package com.marakame.api.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Locale;

@Converter
public class TipoCompraConverter implements AttributeConverter<TipoCompra, String> {

    private static final Logger log = LoggerFactory.getLogger(TipoCompraConverter.class);

    private static String normalizar(String valor) {
        return valor
                .trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_')
                .replace("__", "_");
    }

    @Override
    public String convertToDatabaseColumn(TipoCompra tipo) {
        return tipo == null ? null : tipo.name();
    }

    @Override
    public TipoCompra convertToEntityAttribute(String valor) {
        if (valor == null) return null;
        String normalizado = normalizar(valor);

        try {
            return TipoCompra.valueOf(normalizado);
        } catch (IllegalArgumentException ex) {
            log.warn("Valor de tipo no reconocido en BD '{}' , se usa ORDINARIA", valor);
            return TipoCompra.ORDINARIA;
        }
    }
}