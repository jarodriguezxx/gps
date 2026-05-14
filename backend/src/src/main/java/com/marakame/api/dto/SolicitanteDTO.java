package com.marakame.api.dto;

// Un 'record' automáticamente genera constructores y getters.
public record SolicitanteDTO(
    String nombre,
    String nombres,
    String apellidoPaterno,
    String apellidoMaterno,
    String lugar,
    String ocupacion,
    String direccionCalle,
    String direccionNoExt,
    String direccionNoInt,
    String direccionColonia,
    String direccionMunicipioDelegacion,
    String direccionCp,
    String direccionCiudadEstado,
    String domicilioParticular,
    String parentescoPaciente,
    String telefono,
    String celular,
    String fuenteReferencia,
    String fuenteReferenciaOtro
) {}