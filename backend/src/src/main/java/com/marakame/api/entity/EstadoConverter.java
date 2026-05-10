package com.marakame.api.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EstadoConverter implements AttributeConverter<Estado, String> {

    @Override
    public String convertToDatabaseColumn(Estado estado) {
        if (estado == null) return null;
        return estado.name().replace('_', '-');
    }

    @Override
    public Estado convertToEntityAttribute(String valor) {
        if (valor == null) return null;
        try {
            return Estado.valueOf(valor.replace('-', '_'));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
