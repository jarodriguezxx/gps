package com.marakame.api.controller;

import com.marakame.api.entity.SeguimientoValoracion;
import com.marakame.api.entity.ValoracionMedica;
import com.marakame.api.service.ValoracionMedicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/valoraciones")
@CrossOrigin(origins = "http://localhost:5173") // Permitimos la conexión directa con tu React
public class ValoracionMedicaController {

    @Autowired
    private ValoracionMedicaService valoracionService;

    // 1. OBTENER LA VALORACIÓN DE UN PROSPECTO (Si existe)
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerValoracionPorPaciente(@PathVariable Long pacienteId) {
        Optional<ValoracionMedica> valoracion = valoracionService.obtenerValoracionPorPaciente(pacienteId);
        
        if (valoracion.isPresent()) {
            return ResponseEntity.ok(valoracion.get());
        }
        // Si no tiene valoración, devolvemos un 404 controlado para que React sepa que puede crear una nueva
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", "Este prospecto aún no tiene una valoración médica inicial."));
    }

    // 2. CREAR LA VALORACIÓN INICIAL DE UN PROSPECTO
    @PostMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> crearValoracion(@PathVariable Long pacienteId, @RequestBody ValoracionMedica datosValoracion) {
        try {
            ValoracionMedica nuevaValoracion = valoracionService.crearValoracion(pacienteId, datosValoracion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaValoracion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al guardar la valoración: " + e.getMessage()));
        }
    }

    // 3. AGREGAR UN SEGUIMIENTO A UNA VALORACIÓN EXISTENTE
    @PostMapping("/{valoracionId}/seguimientos")
    public ResponseEntity<?> agregarSeguimiento(@PathVariable Long valoracionId, @RequestBody SeguimientoValoracion nuevoSeguimiento) {
        try {
            SeguimientoValoracion seguimientoGuardado = valoracionService.agregarSeguimiento(valoracionId, nuevoSeguimiento);
            return ResponseEntity.status(HttpStatus.CREATED).body(seguimientoGuardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al guardar el seguimiento: " + e.getMessage()));
        }
    }
}
