package com.marakame.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @PutMapping("/{id}/estudio-basico")
    public ResponseEntity<String> actualizarEstudioBasico(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload
    ) {
        try {
            pacienteService.actualizarDatosBasicosEstudio(id, payload);
            return new ResponseEntity<>("Datos basicos actualizados con exito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar estudio basico: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/estudio-socioeconomico/pdf")
    public ResponseEntity<Map<String, Object>> generarPdfSocioeconomico(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload
    ) {
        try {
            var pdf = pacienteService.generarYGuardarPdfEstudio(id, payload);
            return ResponseEntity.ok(Map.of(
                "pdfId", pdf.getId(),
                "pacienteId", id,
                "nombreArchivo", pdf.getNombreArchivo()
            ));
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                "error", "Error al generar el PDF: " + e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}