package com.marakame.api.entity;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "seguimientos")
public class Seguimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Aquí guardas: "Llamada", "Visita", "Cita Ingreso"
    private String tipoAccion; 

    // Aquí guardas: "En espera de llamada", "Confirmada", "No contestó"
    private String estadoSeguimiento; 

    // Origen del flujo de llamada: "NOSOTROS" o "PROSPECTO"
    private String origenLlamada;

    // Estado de asistencia para citas: "Pendiente", "Llegó", "No se presentó"
    private String estadoAsistencia;

    // Captura clínica al confirmar llegada
    private String diagnosticoVisual;

    private LocalDateTime fechaHoraProgramada;
    private String motivo;

    // Conectamos el seguimiento al paciente
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    // Getters y Setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoAccion() {
        return tipoAccion;
    }

    public void setTipoAccion(String tipoAccion) {
        this.tipoAccion = tipoAccion;
    }

    public String getEstadoSeguimiento() {
        return estadoSeguimiento;
    }

    public void setEstadoSeguimiento(String estadoSeguimiento) {
        this.estadoSeguimiento = estadoSeguimiento;
    }

    public String getOrigenLlamada() {
        return origenLlamada;
    }

    public void setOrigenLlamada(String origenLlamada) {
        this.origenLlamada = origenLlamada;
    }

    public String getEstadoAsistencia() {
        return estadoAsistencia;
    }

    public void setEstadoAsistencia(String estadoAsistencia) {
        this.estadoAsistencia = estadoAsistencia;
    }

    public String getDiagnosticoVisual() {
        return diagnosticoVisual;
    }

    public void setDiagnosticoVisual(String diagnosticoVisual) {
        this.diagnosticoVisual = diagnosticoVisual;
    }

    public LocalDateTime getFechaHoraProgramada() {
        return fechaHoraProgramada;
    }

    public void setFechaHoraProgramada(LocalDateTime fechaHoraProgramada) {
        this.fechaHoraProgramada = fechaHoraProgramada;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    
}