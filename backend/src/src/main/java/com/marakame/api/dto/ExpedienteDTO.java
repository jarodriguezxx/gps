package com.marakame.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ExpedienteDTO(
    Long id,
    String numeroExpediente,
    String estado,
    LocalDateTime fechaApertura,
    List<NotaEvolucionDTO> notas
) {}
