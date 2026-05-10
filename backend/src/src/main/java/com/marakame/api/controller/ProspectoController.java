package com.marakame.api.controller;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prospectos")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class ProspectoController {

    @GetMapping
    public ResponseEntity<?> obtenerProspectosDummy() {
        // Retorna una lista vacía temporalmente para apagar el error 404 de React
        // Ya después lo conectaremos a su tabla real en PostgreSQL
        return ResponseEntity.ok(new ArrayList<>());
    }
}
