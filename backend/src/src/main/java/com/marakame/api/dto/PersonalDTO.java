package com.marakame.api.dto;

public record PersonalDTO(
    String nombre,
    String apellidoPaterno,
    String apellidoMaterno,
    String curp,
    String rfc,
    String fechaNacimiento,
    String sexo,
    String estadoCivil,
    String telefono,
    String correoElectronico,
    String domicilio,
    String departamento,
    String puesto,
    String fechaIngreso,
    String tipoContrato,
    String escolaridad,
    Integer anosExperiencia
) {}
