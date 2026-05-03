package com.marakame.api.controller;

import com.marakame.api.entity.HistoriaMedica;
import com.marakame.api.repository.HistoriaMedicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/historia-medica")
@CrossOrigin(origins = "http://localhost:5173") // Asegúrate de que el puerto coincida con tu React
public class HistoriaMedicaController {

    @Autowired
    private HistoriaMedicaRepository repository;

    // POST: Recibe el JSON de React y lo guarda en PostgreSQL
    @PostMapping
    public ResponseEntity<HistoriaMedica> crearHistoria(@RequestBody HistoriaMedica historia) {
        // Opcional: Podrías validar si ya existe una historia para ese paciente antes de guardar
        HistoriaMedica nuevaHistoria = repository.save(historia);
        return ResponseEntity.ok(nuevaHistoria);
    }

    // GET: React usa esto para saber si quita al paciente de la lista de pendientes
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<HistoriaMedica> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return repository.findByPacienteId(pacienteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()); // Este es el famoso 404 que usa el ComboBox
    }
}
