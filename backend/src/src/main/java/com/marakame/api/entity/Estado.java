package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Estado {
    PENDIENTE,
    PRE_AUTORIZADA,
    EN_REVISION,
    AUTORIZADA,
    FINALIZADA,
    RECHAZADA;

    @JsonValue
    public String toJson() {
        return this.name().replace('_', '-');
    }

    @JsonCreator
    public static Estado fromJson(String value) {
        return Estado.valueOf(value.replace('-', '_'));
    }
}
