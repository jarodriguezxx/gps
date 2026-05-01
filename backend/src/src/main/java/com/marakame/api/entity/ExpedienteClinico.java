package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "expedientes_clinicos")
public class ExpedienteClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroExpediente;

    @OneToOne
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    @JsonIgnoreProperties("expediente")
    private Paciente paciente;

    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura;

    @Column(name = "estado_expediente")
    private String estado;

    @OneToMany(mappedBy = "expediente", cascade = CascadeType.ALL)
    private List<NotaEvolucion> notas;

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroExpediente() { return numeroExpediente; }
    public void setNumeroExpediente(String numeroExpediente) { this.numeroExpediente = numeroExpediente; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public LocalDateTime getFechaApertura() { return fechaApertura; }
    public void setFechaApertura(LocalDateTime fechaApertura) { this.fechaApertura = fechaApertura; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public List<NotaEvolucion> getNotas() { return notas; }
    public void setNotas(List<NotaEvolucion> notas) { this.notas = notas; }
}