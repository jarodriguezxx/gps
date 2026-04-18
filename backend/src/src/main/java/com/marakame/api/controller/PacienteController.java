package com.marakame.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.service.PacienteService;

@RestController
@RequestMapping("/api/pacientes")
// Importante: Permitir que React (puerto 5173) se comunique con el Backend (puerto 4000)
@CrossOrigin(origins = "http://localhost:5173") 
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/guardar-expediente")
    public ResponseEntity<String> guardarExpediente(@RequestBody PacienteDTO dto) {
        try {
            // Llamamos al servicio que creamos antes para guardar todo en cadena
            pacienteService.guardarNuevoExpediente(dto);
            
            return new ResponseEntity<>("Expediente y seguimiento creados con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            // Si algo sale mal (ej. error de base de datos), avisamos al frontend
            return new ResponseEntity<>("Error al guardar el expediente: " + e.getMessage(), 
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}