package com.marakame.api.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "expedientes_medicos")
public class ExpedienteMedico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "paciente_id", nullable = false, unique = true)
    private Paciente paciente;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaUltimaActualizacion;
    
    // Referencia a Historia Médica (si existe)
    @OneToOne
    @JoinColumn(name = "historia_medica_id", nullable = true)
    private HistoriaMedica historiaMedica;
    
    // Notas generales del expediente
    private String notas;
    
    // Estado del expediente
    private String estado; // ACTIVO, ARCHIVADO, COMPLETADO, etc.

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaUltimaActualizacion() {
        return fechaUltimaActualizacion;
    }

    public void setFechaUltimaActualizacion(LocalDateTime fechaUltimaActualizacion) {
        this.fechaUltimaActualizacion = fechaUltimaActualizacion;
    }

    public HistoriaMedica getHistoriaMedica() {
        return historiaMedica;
    }

    public void setHistoriaMedica(HistoriaMedica historiaMedica) {
        this.historiaMedica = historiaMedica;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
