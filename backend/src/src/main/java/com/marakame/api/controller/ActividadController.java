package com.marakame.api.controller;

import com.marakame.api.entity.Actividad;
import com.marakame.api.repository.ActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository repository;

    @GetMapping
    public List<Actividad> obtenerTodas() {
        return repository.findAllByOrderByFechaCreacionDesc();
    }

    @PostMapping
    public ResponseEntity<Actividad> crear(@RequestBody Actividad actividad) {
        actividad.setEstado("Pendiente");
        return ResponseEntity.ok(repository.save(actividad));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return repository.findById(id).map(actividad -> {
            String nuevoEstado = body.get("estado");
            if (nuevoEstado != null) actividad.setEstado(nuevoEstado);
            return ResponseEntity.ok(repository.save(actividad));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return repository.findById(id).map(a -> {
            repository.delete(a);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
