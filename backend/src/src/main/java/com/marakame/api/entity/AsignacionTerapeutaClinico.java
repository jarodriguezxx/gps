package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "asignaciones_terapeuticas",
       uniqueConstraints = @UniqueConstraint(columnNames = {"paciente_id", "departamento"}))
public class AsignacionTerapeutaClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(nullable = false)
    private String departamento; // "Psicología", "Consejería", "Familia"

    @Column(name = "terapeuta_nombre")
    private String terapeutaNombre;

    @Column(name = "personal_id")
    private Long personalId;

    @Column(name = "fecha_asignacion")
    private OffsetDateTime fechaAsignacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getTerapeutaNombre() { return terapeutaNombre; }
    public void setTerapeutaNombre(String terapeutaNombre) { this.terapeutaNombre = terapeutaNombre; }

    public Long getPersonalId() { return personalId; }
    public void setPersonalId(Long personalId) { this.personalId = personalId; }

    public OffsetDateTime getFechaAsignacion() { return fechaAsignacion; }
    public void setFechaAsignacion(OffsetDateTime fechaAsignacion) { this.fechaAsignacion = fechaAsignacion; }
}
