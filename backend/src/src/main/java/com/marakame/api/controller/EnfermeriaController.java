package com.marakame.api.controller;

import com.marakame.api.entity.DispensacionMedicamento;
import com.marakame.api.entity.Inventario;
import com.marakame.api.repository.DispensacionMedicamentoRepository;
import com.marakame.api.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enfermeria")
public class EnfermeriaController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private DispensacionMedicamentoRepository dispensacionRepository;

    @GetMapping("/medicamentos")
    public List<Inventario> obtenerMedicamentos() {
        return inventarioRepository.findAll().stream()
            .filter(i -> "MEDICO".equalsIgnoreCase(i.getCategoria())
                      || "MEDICAMENTO".equalsIgnoreCase(i.getCategoria()))
            .collect(Collectors.toList());
    }

    // Jefe Médico registra recepción de empaques y convierte a unidades de dispensación
    // Future: el body puede incluir "transferenciaId" para ligar a una transferencia formal
    @PostMapping("/recibir/{inventarioId}")
    @Transactional
    public ResponseEntity<?> recibirMedicamento(
            @PathVariable Long inventarioId,
            @RequestBody Map<String, Object> body) {
        try {
            Optional<Inventario> itemOpt = inventarioRepository.findById(inventarioId);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Medicamento no encontrado");
            }

            Inventario item = itemOpt.get();
            int cantidadEmpaques = ((Number) body.get("cantidadEmpaques")).intValue();
            int upe = item.getUnidadesPorEmpaque() != null ? item.getUnidadesPorEmpaque() : 1;

            int stockActual = item.getStockEnfermeria() != null ? item.getStockEnfermeria() : 0;
            item.setStockEnfermeria(stockActual + (cantidadEmpaques * upe));

            inventarioRepository.save(item);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar recepción: " + e.getMessage());
        }
    }

    // Jefe Médico configura unidades por empaque de un medicamento
    @PutMapping("/medicamentos/{inventarioId}")
    @Transactional
    public ResponseEntity<?> actualizarConfiguracion(
            @PathVariable Long inventarioId,
            @RequestBody Map<String, Object> body) {
        try {
            Optional<Inventario> itemOpt = inventarioRepository.findById(inventarioId);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Medicamento no encontrado");
            }

            Inventario item = itemOpt.get();
            if (body.containsKey("unidadesPorEmpaque")) {
                item.setUnidadesPorEmpaque(((Number) body.get("unidadesPorEmpaque")).intValue());
            }
            inventarioRepository.save(item);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar configuración: " + e.getMessage());
        }
    }

    // Enfermero dispensa unidades a un paciente
    @PostMapping("/dispensar")
    @Transactional
    public ResponseEntity<?> dispensarMedicamento(@RequestBody DispensacionMedicamento dispensacion) {
        try {
            Optional<Inventario> itemOpt = inventarioRepository.findById(dispensacion.getInventarioId());
            if (itemOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Medicamento no encontrado");
            }

            Inventario item = itemOpt.get();
            int stockActual = item.getStockEnfermeria() != null ? item.getStockEnfermeria() : 0;

            if (stockActual < dispensacion.getCantidad()) {
                return ResponseEntity.badRequest()
                    .body("Stock insuficiente en enfermería. Disponible: " + stockActual);
            }

            item.setStockEnfermeria(stockActual - dispensacion.getCantidad());
            inventarioRepository.save(item);

            dispensacion.setMedicamentoNombre(item.getNombreArticulo());
            DispensacionMedicamento guardada = dispensacionRepository.save(dispensacion);
            return ResponseEntity.ok(guardada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al dispensar: " + e.getMessage());
        }
    }

    @GetMapping("/historial")
    public List<DispensacionMedicamento> obtenerHistorial() {
        return dispensacionRepository.findAllByOrderByFechaHoraDesc();
    }
}
