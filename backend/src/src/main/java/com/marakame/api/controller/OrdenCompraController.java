package com.marakame.api.controller;

import com.marakame.api.dto.ActualizarOrdenCompraRequest;
import com.marakame.api.entity.OrdenCompra;
import com.marakame.api.service.OrdenCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("/api/ordenes-compra")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class OrdenCompraController {

    @Autowired
    private OrdenCompraService service;

    @GetMapping
    public ResponseEntity<?> obtenerPorRequisicion(@RequestParam UUID requisicionId) {
        return service.obtenerPorRequisicion(requisicionId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearBorrador(@RequestBody Map<String, String> body) {
        try {
            UUID requisicionId = UUID.fromString(body.get("requisicionId"));
            return ResponseEntity.ok(service.crearBorrador(requisicionId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable UUID id, @RequestBody ActualizarOrdenCompraRequest req) {
        try {
            return ResponseEntity.ok(service.actualizar(id, req));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/firmar-encargado")
    public ResponseEntity<?> firmarEncargado(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.firmarEncargado(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/enviar")
    public ResponseEntity<?> enviar(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.enviar(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
