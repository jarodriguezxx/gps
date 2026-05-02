package com.marakame.api.dto;

import java.util.List;

public record HistoriaMedicaDTO(
    Long pacienteId,
    String nombreProspecto,
    Integer edadProspecto,
    String sexoProspecto,
    String estadoCivilProspecto,
    String religionProspecto,
    String lugarResidencia,
    String lugarOrigen,
    String ocupacion,
    String escolaridad,
    String historiaConsumo,
    List<String> sisCabeza,
    List<String> sisCardio,
    List<String> sisGastro,
    List<String> sisGenito,
    List<String> sisNeuro,
    List<String> expCabeza,
    List<String> expOrl,
    List<String> expOrofaringe,
    List<String> expCuello,
    List<String> expTorax,
    List<String> expPulmones,
    List<String> expCorazon,
    List<String> expAbdomen,
    List<String> expExtremidades,
    String diagnosticoCie10,
    String recomendacionesPlan,
    String medicoNombre,
    String medicoCedula
) {}