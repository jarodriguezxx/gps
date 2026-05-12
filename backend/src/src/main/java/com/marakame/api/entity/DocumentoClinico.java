package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "documentos_clinicos")
public class DocumentoClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "nombre_paso", nullable = false)
    private String nombrePaso;

    @Column(nullable = false)
    private String departamento; // "Psicología", "Consejería", "Familia"

    @Column(name = "nombre_archivo")
    private String nombreArchivo;

    // Ruta relativa para servir via HTTP: uploads/expedientes/archivo.pdf
    @Column(name = "ruta_archivo")
    private String rutaArchivo;

    @Column(name = "tipo_archivo")
    private String tipoArchivo;

    @Column(name = "fecha_subida")
    private OffsetDateTime fechaSubida;

    @PrePersist
    protected void onCreate() {
        fechaSubida = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getNombrePaso() { return nombrePaso; }
    public void setNombrePaso(String nombrePaso) { this.nombrePaso = nombrePaso; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }

    public String getRutaArchivo() { return rutaArchivo; }
    public void setRutaArchivo(String rutaArchivo) { this.rutaArchivo = rutaArchivo; }

    public String getTipoArchivo() { return tipoArchivo; }
    public void setTipoArchivo(String tipoArchivo) { this.tipoArchivo = tipoArchivo; }

    public OffsetDateTime getFechaSubida() { return fechaSubida; }
    public void setFechaSubida(OffsetDateTime fechaSubida) { this.fechaSubida = fechaSubida; }
}
