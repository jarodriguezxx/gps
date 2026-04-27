package com.marakame.api.dto;

import java.time.LocalDateTime;

public record SeguimientoTablaDTO(
    Long id,
    Long pacienteId,
    String tipoAccion,
    String estadoSeguimiento,
    String origenLlamada,
    String estadoAsistencia,
    String diagnosticoVisual,
    LocalDateTime fechaHoraProgramada,
    String motivo,
    String pacienteNombre,
    String pacienteTelefono
) {}