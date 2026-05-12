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

    // GET: devuelve 200+null cuando no existe (evita 404 en consola del browser)
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(repository.findByPacienteId(pacienteId).orElse(null));
    }
}
