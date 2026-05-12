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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.entity.Actividad;
import com.marakame.api.repository.ActividadRepository;

@RestController
@RequestMapping("/api/actividades")
@CrossOrigin(origins = "*") // O los orígenes que ya tengas configurados
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    // GET: Para mostrar en el Calendario del Jefe y el Dashboard del Terapeuta
    @GetMapping
    public List<Actividad> obtenerTodas() {
        // En un caso real podrías ordenarlas por fecha
        return actividadRepository.findAll();
    }

    // POST: Para cuando el Terapeuta le da a "Enviar a Revisión"
    @PostMapping
    public ResponseEntity<Actividad> crearActividad(@RequestBody Actividad nuevaActividad) {
        nuevaActividad.setEstado("Pendiente"); // Forzamos el estado inicial por seguridad
        Actividad guardada = actividadRepository.save(nuevaActividad);
        return ResponseEntity.ok(guardada);
    }

    // PUT: Para cuando el Jefe Clínico da clic en "Aprobar" o "Rechazar"
    @PutMapping("/{id}/estado")
    public ResponseEntity<Actividad> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return actividadRepository.findById(id)
            .map(actividad -> {
                actividad.setEstado(body.get("estado"));
                Actividad actualizada = actividadRepository.save(actividad);
                return ResponseEntity.ok(actualizada);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}