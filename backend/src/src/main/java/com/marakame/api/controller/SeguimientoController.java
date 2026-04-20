package com.marakame.api.controller;

import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.SeguimientoTablaDTO;
import com.marakame.api.entity.Seguimiento;
import com.marakame.api.repository.SeguimientoRepository;

@RestController
@RequestMapping("/api/seguimientos")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class SeguimientoController {

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @GetMapping("/tablas")
    public SeguimientoTablasResponse obtenerTablasAdmisiones() {
        List<SeguimientoTablaDTO> seguimiento = seguimientoRepository.findAll()
            .stream()
            .map(this::toTablaDTO)
            .toList();

        List<SeguimientoTablaDTO> citas = seguimiento.stream()
            .filter(item -> !esLlamada(item.tipoAccion()))
            .toList();

        List<SeguimientoTablaDTO> llamadas = seguimiento.stream()
            .filter(item -> esLlamada(item.tipoAccion()))
            .toList();

        return new SeguimientoTablasResponse(citas, llamadas);
    }

    private SeguimientoTablaDTO toTablaDTO(Seguimiento seguimiento) {
        String nombre = seguimiento.getPaciente() != null ? seguimiento.getPaciente().getNombreCompleto() : "Sin nombre";
        String telefono = seguimiento.getPaciente() != null ? seguimiento.getPaciente().getTelefonoContacto() : "";

        return new SeguimientoTablaDTO(
            seguimiento.getId(),
            seguimiento.getTipoAccion(),
            seguimiento.getEstadoSeguimiento(),
            seguimiento.getFechaHoraProgramada(),
            seguimiento.getMotivo(),
            nombre,
            telefono
        );
    }

    private boolean esLlamada(String tipoAccion) {
        return tipoAccion != null && tipoAccion.toLowerCase(Locale.ROOT).contains("llamada");
    }

    public record SeguimientoTablasResponse(
        List<SeguimientoTablaDTO> citas,
        List<SeguimientoTablaDTO> llamadas
    ) {}
}