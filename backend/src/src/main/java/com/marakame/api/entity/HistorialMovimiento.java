package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "historial_movimientos")
public class HistorialMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    private String tipoMovimiento;
    private String departamentoAnterior;
    private String puestoAnterior;
    private String departamentoNuevo;
    private String puestoNuevo;
    private String motivo;
    private String fechaEfectiva;
    private String fechaRegistro;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Personal getPersonal() { return personal; }
    public void setPersonal(Personal personal) { this.personal = personal; }

    // Expone solo el ID en el JSON sin serializar todo el objeto Personal
    public Long getPersonalId() { return personal != null ? personal.getId() : null; }

    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }

    public String getDepartamentoAnterior() { return departamentoAnterior; }
    public void setDepartamentoAnterior(String departamentoAnterior) { this.departamentoAnterior = departamentoAnterior; }

    public String getPuestoAnterior() { return puestoAnterior; }
    public void setPuestoAnterior(String puestoAnterior) { this.puestoAnterior = puestoAnterior; }

    public String getDepartamentoNuevo() { return departamentoNuevo; }
    public void setDepartamentoNuevo(String departamentoNuevo) { this.departamentoNuevo = departamentoNuevo; }

    public String getPuestoNuevo() { return puestoNuevo; }
    public void setPuestoNuevo(String puestoNuevo) { this.puestoNuevo = puestoNuevo; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getFechaEfectiva() { return fechaEfectiva; }
    public void setFechaEfectiva(String fechaEfectiva) { this.fechaEfectiva = fechaEfectiva; }

    public String getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(String fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
