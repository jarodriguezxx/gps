package com.marakame.api.dto;

import java.time.LocalDateTime;

public record PacienteDTO(
    String nombre,
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
    
    // --- CAMPOS PARA EL SEGUIMIENTO ---
    String estadoSeguimiento, // Ej: "En espera de llamada", "Posible Ingreso"
    LocalDateTime fechaCita,   // Fecha y hora programada
    String motivoAccion       // Notas breves sobre la llamada o visita
) {}