package com.marakame.api.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType; // <-- NUEVO IMPORT
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "valoraciones_medicas")
public class ValoracionMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vinculamos la valoración al Paciente (Prospecto)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonIgnore // <--- AÑADIDO PARA EVITAR ERROR 500 DE SERIALIZACIÓN
    private Paciente paciente;

    private LocalDateTime fechaHora;
    
    @Column(name = "tipo_valoracion")
    private String tipoValoracion; // "PRESENCIAL" o "TELEFONICA"

    // 1. INTERROGATORIO
    private String motivoConsulta;
    @Column(columnDefinition = "TEXT")
    private String padecimientoActual;
    @Column(columnDefinition = "TEXT")
    private String sintomasGenerales;
    @Column(columnDefinition = "TEXT")
    private String tratamientosPrevios;

    // 2. EXPLORACIÓN FÍSICA
    private String ta;
    private String fc;
    private String fr;
    private String temp;
    private String peso;
    private String talla;
    
    @Column(columnDefinition = "TEXT")
    private String exploracionAuscultacion;
    @Column(columnDefinition = "TEXT")
    private String examenMental;

    // 3, 4 y 5. DIAGNÓSTICO Y PLAN
    @Column(columnDefinition = "TEXT")
    private String diagnostico;
    @Column(columnDefinition = "TEXT")
    private String pronostico;
    @Column(columnDefinition = "TEXT")
    private String tratamientoSugerido;

    // DATOS DEL MÉDICO (1era Consulta)
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    private String medicoAsignado;
    private String cedulaMedico;

    // ESTADO DE LA VALORACIÓN
    private Boolean esAptoParaIngreso; 

    // Relación con los seguimientos posteriores
    @OneToMany(mappedBy = "valoracion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // <--- AÑADIDO PARA EVITAR ERROR 500 DE SERIALIZACIÓN
    private List<SeguimientoValoracion> seguimientos;

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

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getTipoValoracion() {
        return tipoValoracion;
    }

    public void setTipoValoracion(String tipoValoracion) {
        this.tipoValoracion = tipoValoracion;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public String getPadecimientoActual() {
        return padecimientoActual;
    }

    public void setPadecimientoActual(String padecimientoActual) {
        this.padecimientoActual = padecimientoActual;
    }

    public String getSintomasGenerales() {
        return sintomasGenerales;
    }

    public void setSintomasGenerales(String sintomasGenerales) {
        this.sintomasGenerales = sintomasGenerales;
    }

    public String getTratamientosPrevios() {
        return tratamientosPrevios;
    }

    public void setTratamientosPrevios(String tratamientosPrevios) {
        this.tratamientosPrevios = tratamientosPrevios;
    }

    public String getTa() {
        return ta;
    }

    public void setTa(String ta) {
        this.ta = ta;
    }

    public String getFc() {
        return fc;
    }

    public void setFc(String fc) {
        this.fc = fc;
    }

    public String getFr() {
        return fr;
    }

    public void setFr(String fr) {
        this.fr = fr;
    }

    public String getTemp() {
        return temp;
    }

    public void setTemp(String temp) {
        this.temp = temp;
    }

    public String getPeso() {
        return peso;
    }

    public void setPeso(String peso) {
        this.peso = peso;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public String getExploracionAuscultacion() {
        return exploracionAuscultacion;
    }

    public void setExploracionAuscultacion(String exploracionAuscultacion) {
        this.exploracionAuscultacion = exploracionAuscultacion;
    }

    public String getExamenMental() {
        return examenMental;
    }

    public void setExamenMental(String examenMental) {
        this.examenMental = examenMental;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getPronostico() {
        return pronostico;
    }

    public void setPronostico(String pronostico) {
        this.pronostico = pronostico;
    }

    public String getTratamientoSugerido() {
        return tratamientoSugerido;
    }

    public void setTratamientoSugerido(String tratamientoSugerido) {
        this.tratamientoSugerido = tratamientoSugerido;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getMedicoAsignado() {
        return medicoAsignado;
    }

    public void setMedicoAsignado(String medicoAsignado) {
        this.medicoAsignado = medicoAsignado;
    }

    public String getCedulaMedico() {
        return cedulaMedico;
    }

    public void setCedulaMedico(String cedulaMedico) {
        this.cedulaMedico = cedulaMedico;
    }

    public Boolean getEsAptoParaIngreso() {
        return esAptoParaIngreso;
    }

    public void setEsAptoParaIngreso(Boolean esAptoParaIngreso) {
        this.esAptoParaIngreso = esAptoParaIngreso;
    }

    public List<SeguimientoValoracion> getSeguimientos() {
        return seguimientos;
    }

    public void setSeguimientos(List<SeguimientoValoracion> seguimientos) {
        this.seguimientos = seguimientos;
    }
}