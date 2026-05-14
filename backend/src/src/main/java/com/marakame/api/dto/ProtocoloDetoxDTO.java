package com.marakame.api.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class ProtocoloDetoxDTO {
    private Long id;
    private Long pacienteId;
    private String medicamento;
    private Integer duracionDias;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;
    private String medicoCreadoPor;
    private String estado;
    private List<DosisDTO> dosis;

    public ProtocoloDetoxDTO() {}

    public ProtocoloDetoxDTO(Long id, Long pacienteId, String medicamento, Integer duracionDias,
                            OffsetDateTime fechaCreacion, String estado, String medicoCreadoPor) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.medicamento = medicamento;
        this.duracionDias = duracionDias;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.medicoCreadoPor = medicoCreadoPor;
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

    public List<DosisDTO> getDosis() { return dosis; }
    public void setDosis(List<DosisDTO> dosis) { this.dosis = dosis; }
}
