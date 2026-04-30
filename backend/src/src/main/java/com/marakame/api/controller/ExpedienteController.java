package com.marakame.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.entity.ArchivoExpediente;
import com.marakame.api.entity.ExpedienteMedico;
import com.marakame.api.service.ExpedienteService;

@RestController
@RequestMapping("/api/expedientes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ExpedienteController {

    @Autowired
    private ExpedienteService expedienteService;

    @PostMapping("/crear/{pacienteId}")
    public ResponseEntity<ExpedienteMedico> crearExpediente(@PathVariable Long pacienteId) {
        try {
            ExpedienteMedico expediente = expedienteService.crearExpediente(pacienteId);
            return ResponseEntity.ok(expediente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<ExpedienteMedico> obtenerExpedientePorPaciente(@PathVariable Long pacienteId) {
        try {
            ExpedienteMedico expediente = expedienteService.obtenerExpedientePorPaciente(pacienteId);
            return ResponseEntity.ok(expediente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{expedienteId}")
    public ResponseEntity<ExpedienteMedico> obtenerExpediente(@PathVariable Long expedienteId) {
        try {
            ExpedienteMedico expediente = expedienteService.obtenerExpediente(expedienteId);
            return ResponseEntity.ok(expediente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{expedienteId}/vincular-historia/{historiaMedicaId}")
    public ResponseEntity<ExpedienteMedico> vincularHistoriaMedica(
            @PathVariable Long expedienteId,
            @PathVariable Long historiaMedicaId) {
        try {
            ExpedienteMedico expediente = expedienteService.vincularHistoriaMedica(expedienteId, historiaMedicaId);
            return ResponseEntity.ok(expediente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{expedienteId}/archivo")
    public ResponseEntity<ArchivoExpediente> agregarArchivo(
            @PathVariable Long expedienteId,
            @RequestParam String nombreArchivo,
            @RequestParam String rutaArchivo,
            @RequestParam String tipoArchivo,
            @RequestParam String tipoDocumento,
            @RequestParam String subidoPor) {
        try {
            ArchivoExpediente archivo = expedienteService.agregarArchivo(
                    expedienteId, nombreArchivo, rutaArchivo, tipoArchivo, tipoDocumento, subidoPor);
            return ResponseEntity.ok(archivo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{expedienteId}/archivos")
    public ResponseEntity<List<ArchivoExpediente>> obtenerArchivos(@PathVariable Long expedienteId) {
        try {
            List<ArchivoExpediente> archivos = expedienteService.obtenerArchivosExpediente(expedienteId);
            return ResponseEntity.ok(archivos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
