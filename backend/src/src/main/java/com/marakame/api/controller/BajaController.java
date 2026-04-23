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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.BajaDTO;
import com.marakame.api.entity.Baja;
import com.marakame.api.entity.Personal;
import com.marakame.api.repository.BajaRepository;
import com.marakame.api.repository.PersonalRepository;

@RestController
@RequestMapping("/api/bajas")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class BajaController {

    @Autowired
    private PersonalRepository personalRepository;

    @Autowired
    private BajaRepository bajaRepository;

    // Busca empleados activos por nombre o departamento
    @GetMapping("/personal-activo")
    public List<Personal> buscarPersonalActivo(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String dept) {

        return personalRepository.findAll().stream()
            .filter(Personal::isActivo)
            .filter(p -> {
                String nombre = (p.getNombre() + " " + p.getApellidoPaterno() + " " + p.getApellidoMaterno()).toLowerCase();
                boolean matchQ    = q    == null || q.isBlank()    || nombre.contains(q.toLowerCase());
                boolean matchDept = dept == null || dept.isBlank() || (p.getDepartamento() != null
                        && p.getDepartamento().toLowerCase().contains(dept.toLowerCase()));
                return matchQ && matchDept;
            })
            .collect(Collectors.toList());
    }

    // Registra la baja: guarda el registro en 'bajas' y marca al empleado como inactivo
    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, String>> registrarBaja(@RequestBody BajaDTO dto) {
        Personal personal = personalRepository.findById(dto.personalId())
            .orElse(null);

        if (personal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Empleado no encontrado."));
        }

        if (!personal.isActivo()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "El empleado ya tiene una baja registrada."));
        }

        Baja baja = new Baja();
        baja.setPersonal(personal);
        baja.setFechaBaja(dto.fechaBaja());
        baja.setMotivoBaja(dto.motivoBaja());
        baja.setObservaciones(dto.observaciones());
        baja.setFechaRegistro(LocalDateTime.now().toString());
        bajaRepository.save(baja);

        personal.setActivo(false);
        personalRepository.save(personal);

        return ResponseEntity.ok(Map.of("mensaje", "Baja registrada correctamente."));
    }
}
