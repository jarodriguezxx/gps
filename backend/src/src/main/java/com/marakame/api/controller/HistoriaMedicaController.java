package com.marakame.api.controller;

import java.util.List;

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
import com.marakame.api.entity.HistoriaMedica;
import com.marakame.api.repository.HistoriaMedicaRepository;
import com.marakame.api.service.HistoriaMedicaService;

@RestController
@RequestMapping("/api/historias-medicas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HistoriaMedicaController {

    @Autowired
    private HistoriaMedicaService service;
    @Autowired
    private HistoriaMedicaRepository repository;

    @PostMapping
    public ResponseEntity<HistoriaMedica> crear(@RequestBody HistoriaMedicaDTO dto) {
        return ResponseEntity.ok(service.guardarHistoria(dto));
    }

    @GetMapping("/pre-admision")
    public ResponseEntity<List<HistoriaMedica>> listarPreAdmision() {
        return ResponseEntity.ok(repository.findByPacienteIsNullOrderByFechaRegistroDesc());
    }

    @PutMapping("/{id}/vincular/{pacienteId}")
    public ResponseEntity<HistoriaMedica> vincular(@PathVariable Long id, @PathVariable Long pacienteId) {
        return ResponseEntity.ok(service.enlazarAPaciente(id, pacienteId));
    }
}