package com.marakame.api.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Converter
public class EstadoConverter implements AttributeConverter<Estado, String> {

    private static final Logger log = LoggerFactory.getLogger(EstadoConverter.class);
    private static final Map<String, Estado> ALIASES = new HashMap<>();

    static {
        ALIASES.put("PENDIENTE", Estado.PENDIENTE);
        ALIASES.put("PREAUTORIZADA", Estado.PRE_AUTORIZADA);
        ALIASES.put("PRE_AUTORIZADA", Estado.PRE_AUTORIZADA);
        ALIASES.put("ENREVISION", Estado.EN_REVISION);
        ALIASES.put("EN_REVISION", Estado.EN_REVISION);
        ALIASES.put("AUTORIZADA", Estado.AUTORIZADA);
        ALIASES.put("INCOMPLETA", Estado.INCOMPLETA);
        ALIASES.put("RECIBIDA", Estado.RECIBIDA);
        ALIASES.put("FINALIZADA", Estado.FINALIZADA);
    }

    private static String normalizar(String valor) {
        return valor
                .trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_')
                .replace("__", "_");
    }

    private static String colapsar(String valor) {
        return valor.replace("_", "");
    }

    @Override
    public String convertToDatabaseColumn(Estado estado) {
        if (estado == null) return null;
        return estado.name().replace('_', '-');
    }

    @Override
    public Estado convertToEntityAttribute(String valor) {
        if (valor == null) return null;

        String normalizado = normalizar(valor);
        Estado directo = ALIASES.get(normalizado);
        if (directo != null) return directo;

        Estado colapsado = ALIASES.get(colapsar(normalizado));
        if (colapsado != null) return colapsado;

        try {
            return Estado.valueOf(normalizado);
        } catch (IllegalArgumentException ex) {
            log.warn("Valor de estado no reconocido en BD '{}' , se usa PENDIENTE", valor);
            return Estado.PENDIENTE;
        }
    }
}
