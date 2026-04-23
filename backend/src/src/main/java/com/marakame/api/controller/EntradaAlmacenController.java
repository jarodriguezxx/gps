package com.marakame.api.controller;

import com.marakame.api.entity.EntradaAlmacen;
import com.marakame.api.service.EntradaAlmacenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/almacen/entradas")
@CrossOrigin(origins = "http://localhost:5173") // ¡Súper importante para que React pueda conectarse sin errores de CORS!
public class EntradaAlmacenController {

    @Autowired
    private EntradaAlmacenService service;

    // Ruta GET: Obtener todas las entradas
    @GetMapping
    public ResponseEntity<List<EntradaAlmacen>> obtenerTodasLasEntradas() {
        return new ResponseEntity<>(service.obtenerTodas(), HttpStatus.OK);
    }

    // Ruta POST: Guardar una nueva entrada
    @PostMapping
    public ResponseEntity<?> registrarEntrada(@RequestBody EntradaAlmacen entrada) {
        try {
            EntradaAlmacen nuevaEntrada = service.registrarEntrada(entrada);
            return new ResponseEntity<>(nuevaEntrada, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Ruta PATCH: Actualizar solo el estado de la entrada
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        try {
            EntradaAlmacen entradaActualizada = service.actualizarEstado(id, nuevoEstado);
            return new ResponseEntity<>(entradaActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}