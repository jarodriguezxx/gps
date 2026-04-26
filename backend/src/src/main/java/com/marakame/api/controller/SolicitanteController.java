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
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"}) // ¡Vital para que React no marque error!
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
        nuevo.setDireccionCalle(dto.direccionCalle());
        nuevo.setDireccionNoExt(dto.direccionNoExt());
        nuevo.setDireccionNoInt(dto.direccionNoInt());
        nuevo.setDireccionColonia(dto.direccionColonia());
        nuevo.setDireccionMunicipioDelegacion(dto.direccionMunicipioDelegacion());
        nuevo.setDireccionCp(dto.direccionCp());
        nuevo.setDireccionCiudadEstado(dto.direccionCiudadEstado());
        nuevo.setDomicilioParticular(construirDireccionCompleta(
            dto.direccionCalle(),
            dto.direccionNoExt(),
            dto.direccionNoInt(),
            dto.direccionColonia(),
            dto.direccionMunicipioDelegacion(),
            dto.direccionCp(),
            dto.direccionCiudadEstado(),
            dto.domicilioParticular()
        ));
        nuevo.setParentescoPaciente(dto.parentescoPaciente());
        nuevo.setTelefono(dto.telefono());
        nuevo.setCelular(dto.celular());
        
        return solicitanteRepository.save(nuevo); // Se guarda en PostgreSQL
    }

    private String construirDireccionCompleta(
        String calle,
        String noExt,
        String noInt,
        String colonia,
        String municipioDelegacion,
        String cp,
        String ciudadEstado,
        String fallback
    ) {
        StringBuilder direccion = new StringBuilder();

        agregarParte(direccion, calle);
        agregarParte(direccion, noExt == null || noExt.isBlank() ? null : "No. Ext. " + noExt);
        agregarParte(direccion, noInt == null || noInt.isBlank() ? null : "No. Int. " + noInt);
        agregarParte(direccion, colonia);
        agregarParte(direccion, municipioDelegacion);
        agregarParte(direccion, cp);
        agregarParte(direccion, ciudadEstado);

        if (direccion.length() > 0) {
            return direccion.toString();
        }

        return fallback;
    }

    private void agregarParte(StringBuilder direccion, String parte) {
        if (parte == null || parte.isBlank()) {
            return;
        }

        if (direccion.length() > 0) {
            direccion.append(", ");
        }
        direccion.append(parte.trim());
    }
}