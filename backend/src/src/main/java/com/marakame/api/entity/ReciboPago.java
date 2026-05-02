package com.marakame.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "recibos_pago")
public class ReciboPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Column(name = "numero_recibo", unique = true)
    private String numeroRecibo;

    @Column(name = "monto_pago")
    private Double montoPago;

    @Column(name = "monto_programa")
    private Double montoPrograma;

    @Column(name = "concepto")
    private String concepto;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "nombre_pagador")
    private String nombrePagador;

    @Column(name = "rfc_pagador")
    private String rfcPagador;

    @Column(name = "archivo_recibo_url")
    private String archivoReciboUrl;

    @Column(name = "token_generado")
    private String tokenGenerado;

    @Column(name = "fecha_validacion")
    private LocalDateTime fechaValidacion;

    @Column(name = "estado_pago")
    private String estadoPago = "PENDIENTE"; // PENDIENTE, VALIDADO, RECHAZADO

    @Column(name = "notas")
    private String notas;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

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

    public String getNumeroRecibo() {
        return numeroRecibo;
    }

    public void setNumeroRecibo(String numeroRecibo) {
        this.numeroRecibo = numeroRecibo;
    }

    public Double getMontoPago() {
        return montoPago;
    }

    public void setMontoPago(Double montoPago) {
        this.montoPago = montoPago;
    }

    public Double getMontoPrograma() {
        return montoPrograma;
    }

    public void setMontoPrograma(Double montoPrograma) {
        this.montoPrograma = montoPrograma;
    }

    public String getConcepto() {
        return concepto;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getNombrePagador() {
        return nombrePagador;
    }

    public void setNombrePagador(String nombrePagador) {
        this.nombrePagador = nombrePagador;
    }

    public String getRfcPagador() {
        return rfcPagador;
    }

    public void setRfcPagador(String rfcPagador) {
        this.rfcPagador = rfcPagador;
    }

    public String getArchivoReciboUrl() {
        return archivoReciboUrl;
    }

    public void setArchivoReciboUrl(String archivoReciboUrl) {
        this.archivoReciboUrl = archivoReciboUrl;
    }

    public String getTokenGenerado() {
        return tokenGenerado;
    }

    public void setTokenGenerado(String tokenGenerado) {
        this.tokenGenerado = tokenGenerado;
    }

    public LocalDateTime getFechaValidacion() {
        return fechaValidacion;
    }

    public void setFechaValidacion(LocalDateTime fechaValidacion) {
        this.fechaValidacion = fechaValidacion;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
