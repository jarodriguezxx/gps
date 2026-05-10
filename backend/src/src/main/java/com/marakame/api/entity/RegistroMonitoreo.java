package com.marakame.api.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "registros_monitoreo")
public class RegistroMonitoreo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    @JsonIgnore
    private PlanMonitoreo plan;

    private LocalDate fechaToma;
    private LocalTime horaToma;
    private String resultado;
    private String firma;

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PlanMonitoreo getPlan() { return plan; }
    public void setPlan(PlanMonitoreo plan) { this.plan = plan; }
    public LocalDate getFechaToma() { return fechaToma; }
    public void setFechaToma(LocalDate fechaToma) { this.fechaToma = fechaToma; }
    public LocalTime getHoraToma() { return horaToma; }
    public void setHoraToma(LocalTime horaToma) { this.horaToma = horaToma; }
    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }
    public String getFirma() { return firma; }
    public void setFirma(String firma) { this.firma = firma; }
}