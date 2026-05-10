package com.marakame.api.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Locale;

@Converter
public class TamanioCompraConverter implements AttributeConverter<TamanioCompra, String> {

    private static final Logger log = LoggerFactory.getLogger(TamanioCompraConverter.class);

    private static String normalizar(String valor) {
        return valor
                .trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_')
                .replace("__", "_");
    }

    @Override
    public String convertToDatabaseColumn(TamanioCompra tamanio) {
        return tamanio == null ? null : tamanio.name();
    }

    @Override
    public TamanioCompra convertToEntityAttribute(String valor) {
        if (valor == null) return null;
        String normalizado = normalizar(valor);

        try {
            return TamanioCompra.valueOf(normalizado);
        } catch (IllegalArgumentException ex) {
            log.warn("Valor de tamaño no reconocido en BD '{}' , se usa INDEFINIDO", valor);
            return TamanioCompra.INDEFINIDO;
        }
    }
}