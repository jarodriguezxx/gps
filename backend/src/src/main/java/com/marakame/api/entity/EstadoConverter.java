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
        return Estado.valueOf(valor.replace('-', '_'));
    }
}
