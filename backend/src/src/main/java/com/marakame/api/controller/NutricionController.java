package com.marakame.api.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.entity.ExpedienteNutricional;
import com.marakame.api.repository.ExpedienteNutricionalRepository;

@RestController
@RequestMapping("/api/nutricion")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class NutricionController {

    @Autowired
    private ExpedienteNutricionalRepository nutricionRepository;

    // 1. Obtener la evaluación (se ejecuta al abrir la pantalla en React)
    @GetMapping("/{pacienteId}")
    public ResponseEntity<?> obtenerExpediente(@PathVariable Long pacienteId) {
        try {
            ExpedienteNutricional expediente = nutricionRepository.findByPacienteId(pacienteId);
            if (expediente == null) {
                // Devolvemos un objeto vacío para que React no marque error
                return ResponseEntity.ok(new ExpedienteNutricional());
            }
            return ResponseEntity.ok(expediente);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar expediente: " + e.getMessage());
        }
    }

    // 2. Guardar o Actualizar la evaluación (se ejecuta al darle al botón rojo de Guardar)
    @PostMapping("/{pacienteId}")
    public ResponseEntity<?> guardarExpediente(@PathVariable Long pacienteId, @RequestBody ExpedienteNutricional datos) {
        try {
            ExpedienteNutricional existente = nutricionRepository.findByPacienteId(pacienteId);
            
            // Si el paciente ya tenía expediente nutricional, actualizamos el mismo ID
            if (existente != null) {
                datos.setId(existente.getId()); 
            }
            
            datos.setPacienteId(pacienteId);
            datos.setFechaEvaluacion(LocalDate.now()); // Registra el día de hoy
            
            ExpedienteNutricional guardado = nutricionRepository.save(datos);
            return ResponseEntity.ok(guardado);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar la evaluación: " + e.getMessage());
        }
    }
}