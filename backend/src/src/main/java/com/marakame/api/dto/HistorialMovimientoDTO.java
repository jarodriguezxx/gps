package com.marakame.api.dto;

public record HistorialMovimientoDTO(
    Long personalId,
    String tipoMovimiento,
    String departamentoNuevo,
    String puestoNuevo,
    String motivo,
    String fechaEfectiva
) {}
