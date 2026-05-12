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

    // Movimiento de inventario general → inventario médico
    // Descuenta empaques del stock general y los convierte a unidades mínimas en el área médica
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
            Object cantObj = body.get("cantidadEmpaques");
            if (cantObj == null) return ResponseEntity.badRequest().body("Falta el campo cantidadEmpaques");
            int cantidadEmpaques = ((Number) cantObj).intValue();
            Integer upeBoxed = item.getUnidadesPorEmpaque();
            int upe = upeBoxed != null ? upeBoxed : 1;

            Integer cantDispBoxed = item.getCantidadDisponible();
            int stockGeneral = cantDispBoxed != null ? cantDispBoxed : 0;
            if (stockGeneral < cantidadEmpaques) {
                return ResponseEntity.badRequest()
                    .body("Stock insuficiente en inventario general. Disponible: " + stockGeneral
                        + " " + (item.getUnidadMedida() != null ? item.getUnidadMedida() : "empaques"));
            }

            // Descuenta del inventario general
            item.setCantidadDisponible(stockGeneral - cantidadEmpaques);
            // Suma al inventario médico en unidades mínimas
            Integer stockMedicoBoxed = item.getStockEnfermeria();
            int stockMedico = stockMedicoBoxed != null ? stockMedicoBoxed : 0;
            item.setStockEnfermeria(stockMedico + (cantidadEmpaques * upe));

            inventarioRepository.save(item);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar movimiento: " + e.getMessage());
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
            Object upeObj = body.get("unidadesPorEmpaque");
            if (upeObj != null) {
                item.setUnidadesPorEmpaque(((Number) upeObj).intValue());
            }
            if (body.containsKey("unidadMinima")) {
                item.setUnidadMinima((String) body.get("unidadMinima"));
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
            Integer stockBox = item.getStockEnfermeria();
            int stockActual = stockBox != null ? stockBox : 0;

            Integer cantidadBox = dispensacion.getCantidad();
            int cantidad = cantidadBox != null ? cantidadBox : 0;

            if (stockActual < cantidad) {
                return ResponseEntity.badRequest()
                    .body("Stock insuficiente en enfermería. Disponible: " + stockActual);
            }

            item.setStockEnfermeria(stockActual - cantidad);
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
