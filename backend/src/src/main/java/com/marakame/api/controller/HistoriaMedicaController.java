package com.marakame.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.HistoriaMedicaDTO;
import com.marakame.api.entity.ExpedienteMedico;
import com.marakame.api.entity.HistoriaMedica;
import com.marakame.api.repository.HistoriaMedicaRepository;
import com.marakame.api.service.ExpedienteService;
import com.marakame.api.service.HistoriaMedicaService;

@RestController
@RequestMapping("/api/historias-medicas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HistoriaMedicaController {

    @Autowired
    private HistoriaMedicaService service;
    @Autowired
    private HistoriaMedicaRepository repository;
    @Autowired
    private ExpedienteService expedienteService;

    @PostMapping
    public ResponseEntity<HistoriaMedica> crear(@RequestBody HistoriaMedicaDTO dto) {
        return ResponseEntity.ok(service.guardarHistoria(dto));
    }

    @GetMapping("/pre-admision")
    public ResponseEntity<?> listarPreAdmision() {
        try {
            return ResponseEntity.ok(repository.findByPacienteIsNullOrderByFechaRegistroDesc());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "No se pudo cargar pre-admision",
                "detalle", String.valueOf(e.getMessage())
            ));
        }
    }

    @PutMapping("/{id}/vincular/{pacienteId}")
    public ResponseEntity<?> vincular(@PathVariable Long id, @PathVariable Long pacienteId) {
        try {
            // Vincular historia al paciente
            HistoriaMedica historia = service.enlazarAPaciente(id, pacienteId);
            
            // Crear expediente médico automáticamente
            ExpedienteMedico expediente = expedienteService.crearExpediente(pacienteId);
            
            // Vincular la historia al expediente
            expediente = expedienteService.vincularHistoriaMedica(expediente.getId(), id);
            
            return ResponseEntity.ok(historia);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}