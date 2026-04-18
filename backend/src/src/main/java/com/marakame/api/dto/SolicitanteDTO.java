package com.marakame.api.dto;

// Un 'record' automáticamente genera constructores y getters.
public record SolicitanteDTO(
    String nombre,
    String lugar,
    String ocupacion,
    String domicilioParticular,
    String parentescoPaciente,
    String telefono,
    String celular
) {}