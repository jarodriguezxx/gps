package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "dispensaciones_medicamento")
public class DispensacionMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventario_id")
    private Long inventarioId;

    @Column(name = "paciente_id")
    private Long pacienteId;

    @Column(name = "paciente_nombre")
    private String pacienteNombre;

    @Column(name = "medicamento_nombre")
    private String medicamentoNombre;

    private Integer cantidad;
    private String enfermero;
    private String observaciones;

    @Column(name = "fecha_hora")
    private OffsetDateTime fechaHora;

    // Future: agregar transferenciaId (Long) para ligar a transferencia formal almacén→médico

    @PrePersist
    protected void onCreate() {
        fechaHora = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInventarioId() { return inventarioId; }
    public void setInventarioId(Long inventarioId) { this.inventarioId = inventarioId; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }

    public String getMedicamentoNombre() { return medicamentoNombre; }
    public void setMedicamentoNombre(String medicamentoNombre) { this.medicamentoNombre = medicamentoNombre; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getEnfermero() { return enfermero; }
    public void setEnfermero(String enfermero) { this.enfermero = enfermero; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public OffsetDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(OffsetDateTime fechaHora) { this.fechaHora = fechaHora; }
}
