package com.marakame.api.controller;

import com.marakame.api.entity.Requisicion;
import com.marakame.api.service.RequisicionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("/api/requisiciones")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class RequisicionController {

    @Autowired
    private RequisicionService service;

    @GetMapping
    public List<Requisicion> getAll() {
        return service.obtenerTodas();
    }

    @PostMapping
    public Requisicion create(@RequestBody Requisicion requisicion) {
        return service.crear(requisicion);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Requisicion> getById(@PathVariable UUID id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/enviar")
    public ResponseEntity<?> enviar(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.enviar(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/cotizacion")
    public ResponseEntity<?> eliminarCotizacion(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.eliminarCotizacion(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-eliminando-archivo");
        }
    }

    @PostMapping(value = "/{id}/cotizacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirCotizacion(
            @PathVariable UUID id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            return ResponseEntity.ok(service.guardarCotizacion(id, archivo));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-guardando-archivo");
        }
    }
}
