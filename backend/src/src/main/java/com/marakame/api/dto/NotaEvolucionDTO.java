package com.marakame.api.dto;

import java.time.LocalDateTime;

public record NotaEvolucionDTO(
    String ta, String temp, String fc, String fr, String peso, String talla,
    String evolucionCuadroClinico, String exploracionFisica, String resultadosEstudios,
    String diagnosticoProblemas, String pronosticos, String tratamientoIndicaciones,
    String observaciones, LocalDateTime fechaProximaSesion, String medicoAsignado
) {}