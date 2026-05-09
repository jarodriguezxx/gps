package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expedientes_nutricionales")
public class ExpedienteNutricional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pacienteId;
    private LocalDate fechaEvaluacion;

    @Column(columnDefinition = "TEXT")
    private String alergias;
    
    @Column(columnDefinition = "TEXT")
    private String medicamentosActuales;

    // --- PAQUETES JSON PARA COMPACTAR LOS FORMULARIOS ---
    @Column(columnDefinition = "TEXT")
    private String sintomasJson;
    
    @Column(columnDefinition = "TEXT")
    private String antecedentesJson;
    
    @Column(columnDefinition = "TEXT")
    private String riesgosJson;
    
    @Column(columnDefinition = "TEXT")
    private String antropometriaJson;
    
    @Column(columnDefinition = "TEXT")
    private String dieteticaJson;

    // ==========================================
    // GETTERS Y SETTERS
    // ==========================================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
    
    public LocalDate getFechaEvaluacion() { return fechaEvaluacion; }
    public void setFechaEvaluacion(LocalDate fechaEvaluacion) { this.fechaEvaluacion = fechaEvaluacion; }
    
    public String getAlergias() { return alergias; }
    public void setAlergias(String alergias) { this.alergias = alergias; }
    
    public String getMedicamentosActuales() { return medicamentosActuales; }
    public void setMedicamentosActuales(String medicamentosActuales) { this.medicamentosActuales = medicamentosActuales; }
    
    public String getSintomasJson() { return sintomasJson; }
    public void setSintomasJson(String sintomasJson) { this.sintomasJson = sintomasJson; }
    
    public String getAntecedentesJson() { return antecedentesJson; }
    public void setAntecedentesJson(String antecedentesJson) { this.antecedentesJson = antecedentesJson; }
    
    public String getRiesgosJson() { return riesgosJson; }
    public void setRiesgosJson(String riesgosJson) { this.riesgosJson = riesgosJson; }
    
    public String getAntropometriaJson() { return antropometriaJson; }
    public void setAntropometriaJson(String antropometriaJson) { this.antropometriaJson = antropometriaJson; }
    
    public String getDieteticaJson() { return dieteticaJson; }
    public void setDieteticaJson(String dieteticaJson) { this.dieteticaJson = dieteticaJson; }
}