package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "protocolo_detox")
public class ProtocoloDetox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(nullable = false)
    private String medicamento;

    @Column(name = "duracion_dias", nullable = false)
    private Integer duracionDias;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", nullable = false)
    private OffsetDateTime fechaActualizacion;

    @Column(name = "medico_creado_por")
    private String medicoCreadoPor;

    @Column(nullable = false)
    private String estado; // 'activo', 'completado', 'cancelado'

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "protocolo_detox_id")
    private List<ProtocoloDetoxDosis> dosis;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = OffsetDateTime.now();
        fechaActualizacion = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = OffsetDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getMedicamento() { return medicamento; }
    public void setMedicamento(String medicamento) { this.medicamento = medicamento; }

    public Integer getDuracionDias() { return duracionDias; }
    public void setDuracionDias(Integer duracionDias) { this.duracionDias = duracionDias; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public String getMedicoCreadoPor() { return medicoCreadoPor; }
    public void setMedicoCreadoPor(String medicoCreadoPor) { this.medicoCreadoPor = medicoCreadoPor; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<ProtocoloDetoxDosis> getDosis() { return dosis; }
    public void setDosis(List<ProtocoloDetoxDosis> dosis) { this.dosis = dosis; }
}
