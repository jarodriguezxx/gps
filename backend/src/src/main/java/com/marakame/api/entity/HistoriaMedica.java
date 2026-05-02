package com.marakame.api.entity; // Ajusta tu paquete según tu proyecto

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historia_medica")
public class HistoriaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "medico_asignado")
    private String medicoAsignado;

    @Column(name = "diagnostico_final", columnDefinition = "TEXT")
    private String diagnosticoFinal;

    // Aquí guardaremos el JSON gigante que nos manda React
    @Column(name = "datos_clinicos_json", columnDefinition = "TEXT")
    private String datosClinicosJson;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }

    // Constructor vacío requerido por JPA
    public HistoriaMedica() {
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getMedicoAsignado() { return medicoAsignado; }
    public void setMedicoAsignado(String medicoAsignado) { this.medicoAsignado = medicoAsignado; }

    public String getDiagnosticoFinal() { return diagnosticoFinal; }
    public void setDiagnosticoFinal(String diagnosticoFinal) { this.diagnosticoFinal = diagnosticoFinal; }

    public String getDatosClinicosJson() { return datosClinicosJson; }
    public void setDatosClinicosJson(String datosClinicosJson) { this.datosClinicosJson = datosClinicosJson; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}