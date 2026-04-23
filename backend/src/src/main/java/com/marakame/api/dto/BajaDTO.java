package com.marakame.api.dto;

public record BajaDTO(
    Long personalId,
    String fechaBaja,
    String motivoBaja,
    String observaciones
) {}