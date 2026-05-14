package com.marakame.api.controller;

import com.marakame.api.entity.AsignacionTerapeutaClinico;
import com.marakame.api.repository.AsignacionTerapeutaClinicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/asignaciones-clinico")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AsignacionTerapeutaClinicoController {

    @Autowired
    private AsignacionTerapeutaClinicoRepository repository;

    @GetMapping
    public List<AsignacionTerapeutaClinico> obtenerTodas() {
        return repository.findAll();
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<AsignacionTerapeutaClinico> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return repository.findByPacienteId(pacienteId);
    }

    // Upsert: crea o actualiza la asignación para ese paciente+departamento
    @PostMapping
    public ResponseEntity<AsignacionTerapeutaClinico> asignar(@RequestBody AsignacionTerapeutaClinico dto) {
        AsignacionTerapeutaClinico asignacion = repository
            .findByPacienteIdAndDepartamento(dto.getPacienteId(), dto.getDepartamento())
            .orElse(new AsignacionTerapeutaClinico());
        asignacion.setPacienteId(dto.getPacienteId());
        asignacion.setDepartamento(dto.getDepartamento());
        asignacion.setTerapeutaNombre(dto.getTerapeutaNombre());
        asignacion.setPersonalId(dto.getPersonalId());
        asignacion.setFechaAsignacion(OffsetDateTime.now());
        return ResponseEntity.ok(repository.save(asignacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return repository.findById(id).map(a -> {
            repository.delete(a);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
