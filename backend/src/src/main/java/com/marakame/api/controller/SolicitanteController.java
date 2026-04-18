package com.marakame.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.SolicitanteDTO;
import com.marakame.api.entity.Solicitante;
import com.marakame.api.repository.SolicitanteRepository;

@RestController
@RequestMapping("/api/solicitantes")
@CrossOrigin(origins = "http://localhost:5173") // ¡Vital para que React no marque error!
public class SolicitanteController {

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    // RESUELVE: "Inicialización de datos" (Obtener todos para llenar tablas)
    @GetMapping
    public List<Solicitante> obtenerTodos() {
        return solicitanteRepository.findAll();
    }

    // RESUELVE: "Endpoints REST para CRUD" (Guardar nuevo)
    @PostMapping
    public Solicitante crearSolicitante(@RequestBody SolicitanteDTO dto) {
        // Pasamos los datos del DTO (lo que llega de React) a la Entidad (la base de datos)
        Solicitante nuevo = new Solicitante();
        nuevo.setNombre(dto.nombre());
        nuevo.setLugar(dto.lugar());
        nuevo.setOcupacion(dto.ocupacion());
        nuevo.setDomicilioParticular(dto.domicilioParticular());
        nuevo.setParentescoPaciente(dto.parentescoPaciente());
        nuevo.setTelefono(dto.telefono());
        nuevo.setCelular(dto.celular());
        
        return solicitanteRepository.save(nuevo); // Se guarda en PostgreSQL
    }
}