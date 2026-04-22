package com.marakame.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.Paciente;
import com.marakame.api.service.PacienteService;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping("/estudio")
    public List<Paciente> obtenerPacientesParaEstudio(@RequestParam(required = false) String query) {
        return pacienteService.obtenerPacientesParaEstudio(query);
    }

    @PostMapping("/guardar-expediente")
    public ResponseEntity<String> guardarExpediente(@RequestBody PacienteDTO dto) {
        try {
            pacienteService.guardarNuevoExpediente(dto);
            return new ResponseEntity<>("Expediente y seguimiento creados con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar el expediente: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}