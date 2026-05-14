package com.marakame.api.controller;

import com.marakame.api.dto.DosisDTO;
import com.marakame.api.dto.ProtocoloDetoxDTO;
import com.marakame.api.service.ProtocoloDetoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/protocolo-detox")
@CrossOrigin(origins = "*")
public class ProtocoloDetoxController {

    @Autowired
    private ProtocoloDetoxService protocoloService;

    /**
     * Crear un nuevo protocolo de desintoxicación
     * POST /api/protocolo-detox
     */
    @PostMapping
    public ResponseEntity<ProtocoloDetoxDTO> crearProtocolo(@RequestBody ProtocoloDetoxDTO dto) {
        try {
            ProtocoloDetoxDTO resultado = protocoloService.crearProtocolo(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Actualizar dosis del protocolo
     * PUT /api/protocolo-detox/{id}/dosis
     */
    @PutMapping("/{id}/dosis")
    public ResponseEntity<ProtocoloDetoxDTO> actualizarDosis(
            @PathVariable Long id,
            @RequestBody List<DosisDTO> dosis) {
        try {
            ProtocoloDetoxDTO resultado = protocoloService.actualizarDosis(id, dosis);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Completar protocolo
     * PATCH /api/protocolo-detox/{id}/completar
     */
    @PatchMapping("/{id}/completar")
    public ResponseEntity<ProtocoloDetoxDTO> completarProtocolo(@PathVariable Long id) {
        try {
            ProtocoloDetoxDTO resultado = protocoloService.completarProtocolo(id);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener todos los protocolos de un paciente
     * GET /api/protocolo-detox/paciente/{pacienteId}
     */
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<ProtocoloDetoxDTO>> obtenerPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<ProtocoloDetoxDTO> protocolos = protocoloService.obtenerPorPaciente(pacienteId);
            return ResponseEntity.ok(protocolos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener protocolos activos de un paciente
     * GET /api/protocolo-detox/paciente/{pacienteId}/activos
     */
    @GetMapping("/paciente/{pacienteId}/activos")
    public ResponseEntity<List<ProtocoloDetoxDTO>> obtenerActivosPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<ProtocoloDetoxDTO> protocolos = protocoloService.obtenerActivosPorPaciente(pacienteId);
            return ResponseEntity.ok(protocolos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener detalle de un protocolo
     * GET /api/protocolo-detox/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProtocoloDetoxDTO> obtenerDetalle(@PathVariable Long id) {
        try {
            ProtocoloDetoxDTO protocolo = protocoloService.obtenerDetalle(id);
            return ResponseEntity.ok(protocolo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Eliminar protocolo
     * DELETE /api/protocolo-detox/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProtocolo(@PathVariable Long id) {
        try {
            protocoloService.eliminarProtocolo(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
