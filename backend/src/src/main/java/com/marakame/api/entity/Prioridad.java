package com.marakame.api.entity;

public enum Prioridad {
    ALTA("Alta"),
    MEDIA("Media"),
    BAJA("Baja");

    private final String etiqueta;

    Prioridad(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public String getEtiqueta() {
        return etiqueta;
    }
}
