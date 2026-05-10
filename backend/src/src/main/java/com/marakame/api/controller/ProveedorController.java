package com.marakame.api.controller;

import com.marakame.api.entity.Proveedor;
import com.marakame.api.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class ProveedorController {

    private static final String ROL_REQUERIDO = "rec-materiales";

    @Autowired
    private ProveedorService service;

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestHeader(value = "X-Rol", required = false) String rol,
            @RequestBody Map<String, String> body) {
        if (!ROL_REQUERIDO.equals(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("acceso-denegado");
        }
        try {
            return ResponseEntity.ok(service.crear(body));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @RequestHeader(value = "X-Rol", required = false) String rol,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        if (!ROL_REQUERIDO.equals(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("acceso-denegado");
        }
        try {
            return ResponseEntity.ok(service.actualizar(id, body));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @RequestHeader(value = "X-Rol", required = false) String rol,
            @PathVariable UUID id) {
        if (!ROL_REQUERIDO.equals(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("acceso-denegado");
        }
        try {
            return ResponseEntity.ok(service.cambiarEstatus(id, "INACTIVO"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/estatus")
    public ResponseEntity<?> cambiarEstatus(
            @RequestHeader(value = "X-Rol", required = false) String rol,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        if (!ROL_REQUERIDO.equals(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("acceso-denegado");
        }
        try {
            String nuevoEstatus = body.get("estatus");
            if (nuevoEstatus == null || (!nuevoEstatus.equals("ACTIVO") && !nuevoEstatus.equals("INACTIVO"))) {
                return ResponseEntity.badRequest().body("estatus-invalido");
            }
            return ResponseEntity.ok(service.cambiarEstatus(id, nuevoEstatus));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
