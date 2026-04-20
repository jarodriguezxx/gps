package com.marakame.api.dto;

import java.time.LocalDateTime;

public record SeguimientoTablaDTO(
    Long id,
    String tipoAccion,
    String estadoSeguimiento,
    LocalDateTime fechaHoraProgramada,
    String motivo,
    String pacienteNombre,
    String pacienteTelefono
) {}