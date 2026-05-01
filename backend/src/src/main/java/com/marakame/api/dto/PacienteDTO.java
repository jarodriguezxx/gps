package com.marakame.api.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonAlias;

public record PacienteDTO(
    String nombre,
    String nombres,
    String apellidoPaterno,
    String apellidoMaterno,
    Integer edad,
    String estadocivil,
    Integer hijos,
    String escolaridad,
    String origen,
    String domicilio,
    String telefono,
    String ocupacion,
    String sustancia,
    Long solicitanteId,
    @JsonAlias("llamar_paciente")
    String llamarPaciente,
    
    // --- CAMPOS PARA EL SEGUIMIENTO ---
    @JsonAlias("estado_seguimiento")
    String estadoSeguimiento, // Ej: "En espera de llamada", "Posible Ingreso"
    @JsonAlias("fecha_cita")
    LocalDateTime fechaCita,   // Fecha y hora programada
    @JsonAlias("motivo_accion")
    String motivoAccion       // Notas breves sobre la llamada o visita
) {}