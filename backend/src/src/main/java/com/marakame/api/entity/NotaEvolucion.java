package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "notas_evolucion")
public class NotaEvolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "expediente_id", nullable = false)
    @JsonIgnore
    private ExpedienteClinico expediente;

    // Signos Vitales y Somatometría
    private String ta;
    private String temp;
    private String fc;
    private String fr;
    private String peso;
    private String talla;

    // Apartados Clínicos Oficiales
    @Column(columnDefinition = "TEXT")
    private String evolucionCuadroClinico;
    
    @Column(columnDefinition = "TEXT")
    private String exploracionFisica;
    
    @Column(columnDefinition = "TEXT")
    private String resultadosEstudios;
    
    @Column(columnDefinition = "TEXT")
    private String diagnosticoProblemas;
    
    @Column(columnDefinition = "TEXT")
    private String pronosticos;
    
    @Column(columnDefinition = "TEXT")
    private String tratamientoIndicaciones;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    private LocalDateTime fechaProximaSesion;
    private LocalDateTime fechaRegistro;
    private String medicoAsignado;

// --- Identificadores y Relación ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExpedienteClinico getExpediente() { return expediente; }
    public void setExpediente(ExpedienteClinico expediente) { this.expediente = expediente; }

    // --- Signos Vitales y Somatometría ---
    public String getTa() { return ta; }
    public void setTa(String ta) { this.ta = ta; }

    public String getTemp() { return temp; }
    public void setTemp(String temp) { this.temp = temp; }

    public String getFc() { return fc; }
    public void setFc(String fc) { this.fc = fc; }

    public String getFr() { return fr; }
    public void setFr(String fr) { this.fr = fr; }

    public String getPeso() { return peso; }
    public void setPeso(String peso) { this.peso = peso; }

    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }

    // --- Apartados Clínicos ---
    public String getEvolucionCuadroClinico() { return evolucionCuadroClinico; }
    public void setEvolucionCuadroClinico(String evolucionCuadroClinico) { this.evolucionCuadroClinico = evolucionCuadroClinico; }

    public String getExploracionFisica() { return exploracionFisica; }
    public void setExploracionFisica(String exploracionFisica) { this.exploracionFisica = exploracionFisica; }

    public String getResultadosEstudios() { return resultadosEstudios; }
    public void setResultadosEstudios(String resultadosEstudios) { this.resultadosEstudios = resultadosEstudios; }

    public String getDiagnosticoProblemas() { return diagnosticoProblemas; }
    public void setDiagnosticoProblemas(String diagnosticoProblemas) { this.diagnosticoProblemas = diagnosticoProblemas; }

    public String getPronosticos() { return pronosticos; }
    public void setPronosticos(String pronosticos) { this.pronosticos = pronosticos; }

    public String getTratamientoIndicaciones() { return tratamientoIndicaciones; }
    public void setTratamientoIndicaciones(String tratamientoIndicaciones) { this.tratamientoIndicaciones = tratamientoIndicaciones; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    // --- Metadatos de la Sesión ---
    public LocalDateTime getFechaProximaSesion() { return fechaProximaSesion; }
    public void setFechaProximaSesion(LocalDateTime fechaProximaSesion) { this.fechaProximaSesion = fechaProximaSesion; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public String getMedicoAsignado() { return medicoAsignado; }
    public void setMedicoAsignado(String medicoAsignado) { this.medicoAsignado = medicoAsignado; }
}