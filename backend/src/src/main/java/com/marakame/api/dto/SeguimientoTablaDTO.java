package com.marakame.api.dto;

import java.time.LocalDateTime;
import com.marakame.api.entity.Prioridad;

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
    String pacienteTelefono,
    Prioridad prioridad,
    String responsable,
    LocalDateTime fechaSiguienteAccion
) {}