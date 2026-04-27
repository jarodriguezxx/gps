package com.marakame.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.Paciente;
import com.marakame.api.service.PacienteService;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping("/activos")
    public ResponseEntity<List<Paciente>> obtenerPacientesActivos() {
        try {
            List<Paciente> pacientes = pacienteService.obtenerPacientesActivos();
            return ResponseEntity.ok(pacientes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPaciente(@PathVariable Long id) {
        try {
            Paciente paciente = pacienteService.obtenerPacienteById(id);
            if (paciente != null) {
                return ResponseEntity.ok(paciente);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> obtenerTodosPacientes() {
        try {
            List<Paciente> pacientes = pacienteService.obtenerTodosPacientes();
            return ResponseEntity.ok(pacientes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/guardar-expediente")
    public ResponseEntity<String> guardarExpediente(@RequestBody PacienteDTO dto) {
        try {
            pacienteService.guardarNuevoExpediente(dto);
            return ResponseEntity.status(201).body("Expediente y seguimiento creados con éxito");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al guardar el expediente: " + e.getMessage());
        }
    }
}