package com.marakame.api.entity;

public enum EstadoPaciente {
    PROSPECTO("Prospecto - En evaluación inicial"),
    INGRESADO("Paciente ingresado - En tratamiento"),
    EGRESO("Paciente egresado"),
    DENEGADO("Ingreso denegado por insuficiencia económica");

    private final String descripcion;

    EstadoPaciente(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}