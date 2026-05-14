package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "protocolo_detox_dosis")
public class ProtocoloDetoxDosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "protocolo_detox_id", nullable = false)
    private Long protocoloDetoxId;

    @Column(nullable = false)
    private Integer dia; // 1 a 21

    @Column(nullable = false)
    private String horario; // '7AM', '12PM', '6PM', '9PM'

    @Column
    private String dosis; // cantidad y unidad, ej: "2.5 mg"

    @Column(name = "fecha_actualizacion", nullable = false)
    private OffsetDateTime fechaActualizacion;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = OffsetDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProtocoloDetoxId() { return protocoloDetoxId; }
    public void setProtocoloDetoxId(Long protocoloDetoxId) { this.protocoloDetoxId = protocoloDetoxId; }

    public Integer getDia() { return dia; }
    public void setDia(Integer dia) { this.dia = dia; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public String getDosis() { return dosis; }
    public void setDosis(String dosis) { this.dosis = dosis; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
