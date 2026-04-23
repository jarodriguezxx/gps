package com.marakame.api.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.HistorialMovimientoDTO;
import com.marakame.api.entity.HistorialMovimiento;
import com.marakame.api.entity.Personal;
import com.marakame.api.repository.HistorialMovimientoRepository;
import com.marakame.api.repository.PersonalRepository;

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AsignacionController {

    @Autowired
    private PersonalRepository personalRepository;

    @Autowired
    private HistorialMovimientoRepository historialRepository;

    // Busca empleados activos por nombre para el autocomplete
    @GetMapping("/personal-activo")
    public List<Personal> buscarPersonalActivo(@RequestParam(required = false) String q) {
        return personalRepository.findAll().stream()
            .filter(Personal::isActivo)
            .filter(p -> {
                if (q == null || q.isBlank()) return true;
                String nombre = (p.getNombre() + " " + p.getApellidoPaterno() + " " + p.getApellidoMaterno()).toLowerCase();
                return nombre.contains(q.toLowerCase());
            })
            .collect(Collectors.toList());
    }

    // Devuelve el historial de movimientos de un empleado (más reciente primero)
    @GetMapping("/historial/{personalId}")
    public ResponseEntity<List<HistorialMovimiento>> obtenerHistorial(@PathVariable Long personalId) {
        return ResponseEntity.ok(historialRepository.findByPersonal_IdOrderByFechaRegistroDesc(personalId));
    }

    // Actualiza los campos de dept/puesto de un registro del historial
    @PutMapping("/historial/{id}")
    public ResponseEntity<Map<String, String>> actualizarMovimiento(
            @PathVariable Long id,
            @RequestBody Map<String, String> campos) {

        HistorialMovimiento mov = historialRepository.findById(id).orElse(null);
        if (mov == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Registro no encontrado."));
        }

        if (campos.containsKey("departamentoAnterior")) mov.setDepartamentoAnterior(campos.get("departamentoAnterior"));
        if (campos.containsKey("puestoAnterior"))       mov.setPuestoAnterior(campos.get("puestoAnterior"));
        if (campos.containsKey("departamentoNuevo"))    mov.setDepartamentoNuevo(campos.get("departamentoNuevo"));
        if (campos.containsKey("puestoNuevo"))          mov.setPuestoNuevo(campos.get("puestoNuevo"));

        historialRepository.save(mov);
        return ResponseEntity.ok(Map.of("mensaje", "Registro actualizado."));
    }

    // Elimina un registro del historial por ID
    @DeleteMapping("/historial/{id}")
    public ResponseEntity<Map<String, String>> eliminarMovimiento(@PathVariable Long id) {
        if (!historialRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Registro no encontrado."));
        }
        historialRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Registro eliminado."));
    }

    // Procesa el movimiento: guarda historial y actualiza personal
    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, String>> procesarMovimiento(@RequestBody HistorialMovimientoDTO dto) {
        Personal personal = personalRepository.findById(dto.personalId()).orElse(null);

        if (personal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Empleado no encontrado."));
        }

        if (!personal.isActivo()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "El empleado está dado de baja y no puede recibir movimientos."));
        }

        HistorialMovimiento mov = new HistorialMovimiento();
        mov.setPersonal(personal);
        mov.setTipoMovimiento(dto.tipoMovimiento());
        mov.setDepartamentoAnterior(personal.getDepartamento());
        mov.setPuestoAnterior(personal.getPuesto());
        mov.setDepartamentoNuevo(dto.departamentoNuevo());
        mov.setPuestoNuevo(dto.puestoNuevo());
        mov.setMotivo(dto.motivo());
        mov.setFechaEfectiva(dto.fechaEfectiva());
        mov.setFechaRegistro(LocalDateTime.now().toString());
        historialRepository.save(mov);

        personal.setDepartamento(dto.departamentoNuevo());
        personal.setPuesto(dto.puestoNuevo());
        personalRepository.save(personal);

        return ResponseEntity.ok(Map.of("mensaje", "Movimiento registrado correctamente."));
    }
}
