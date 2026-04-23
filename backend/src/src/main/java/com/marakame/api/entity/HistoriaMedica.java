package com.marakame.api.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "historias_medicas")
public class HistoriaMedica {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = true) // Opcional para pre-admisión
    private Paciente paciente;

    private LocalDateTime fechaRegistro;

    // Datos del prospecto (Paso 1)
    private String nombreProspecto;
    private Integer edadProspecto;
    private String sexoProspecto;
    private String estadoCivilProspecto;
    private String religionProspecto;
    private String lugarResidencia;
    private String lugarOrigen;
    private String ocupacion;
    private String escolaridad;

    @Column(columnDefinition = "TEXT")
    private String historiaConsumo;

    // Interrogatorio por Sistemas (JSONB)
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> sisCabeza;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> sisCardio;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> sisGastro;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> sisGenito;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> sisNeuro;

    // Exploración Física (JSONB)
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expCabeza;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expOrl;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expOrofaringe;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expCuello;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expTorax;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expPulmones;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expCorazon;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expAbdomen;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition = "jsonb")
    private List<String> expExtremidades;

    @Column(columnDefinition = "TEXT")
    private String diagnosticoCie10;
    @Column(columnDefinition = "TEXT")
    private String recomendacionesPlan;

    private String medicoNombre;
    private String medicoCedula;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    public String getNombreProspecto() { return nombreProspecto; }
    public void setNombreProspecto(String nombreProspecto) { this.nombreProspecto = nombreProspecto; }
    public Integer getEdadProspecto() { return edadProspecto; }
    public void setEdadProspecto(Integer edadProspecto) { this.edadProspecto = edadProspecto; }
    public String getSexoProspecto() { return sexoProspecto; }
    public void setSexoProspecto(String sexoProspecto) { this.sexoProspecto = sexoProspecto; }
    public String getEstadoCivilProspecto() { return estadoCivilProspecto; }
    public void setEstadoCivilProspecto(String estadoCivilProspecto) { this.estadoCivilProspecto = estadoCivilProspecto; }
    public String getReligionProspecto() { return religionProspecto; }
    public void setReligionProspecto(String religionProspecto) { this.religionProspecto = religionProspecto; }
    public String getLugarResidencia() { return lugarResidencia; }
    public void setLugarResidencia(String lugarResidencia) { this.lugarResidencia = lugarResidencia; }
    public String getLugarOrigen() { return lugarOrigen; }
    public void setLugarOrigen(String lugarOrigen) { this.lugarOrigen = lugarOrigen; }
    public String getOcupacion() { return ocupacion; }
    public void setOcupacion(String ocupacion) { this.ocupacion = ocupacion; }
    public String getEscolaridad() { return escolaridad; }
    public void setEscolaridad(String escolaridad) { this.escolaridad = escolaridad; }
    public String getHistoriaConsumo() { return historiaConsumo; }
    public void setHistoriaConsumo(String historiaConsumo) { this.historiaConsumo = historiaConsumo; }
    public List<String> getSisCabeza() { return sisCabeza; }
    public void setSisCabeza(List<String> sisCabeza) { this.sisCabeza = sisCabeza; }
    public List<String> getSisCardio() { return sisCardio; }
    public void setSisCardio(List<String> sisCardio) { this.sisCardio = sisCardio; }
    public List<String> getSisGastro() { return sisGastro; }
    public void setSisGastro(List<String> sisGastro) { this.sisGastro = sisGastro; }
    public List<String> getSisGenito() { return sisGenito; }
    public void setSisGenito(List<String> sisGenito) { this.sisGenito = sisGenito; }
    public List<String> getSisNeuro() { return sisNeuro; }
    public void setSisNeuro(List<String> sisNeuro) { this.sisNeuro = sisNeuro; }
    public List<String> getExpCabeza() { return expCabeza; }
    public void setExpCabeza(List<String> expCabeza) { this.expCabeza = expCabeza; }
    public List<String> getExpOrl() { return expOrl; }
    public void setExpOrl(List<String> expOrl) { this.expOrl = expOrl; }
    public List<String> getExpOrofaringe() { return expOrofaringe; }
    public void setExpOrofaringe(List<String> expOrofaringe) { this.expOrofaringe = expOrofaringe; }
    public List<String> getExpCuello() { return expCuello; }
    public void setExpCuello(List<String> expCuello) { this.expCuello = expCuello; }
    public List<String> getExpTorax() { return expTorax; }
    public void setExpTorax(List<String> expTorax) { this.expTorax = expTorax; }
    public List<String> getExpPulmones() { return expPulmones; }
    public void setExpPulmones(List<String> expPulmones) { this.expPulmones = expPulmones; }
    public List<String> getExpCorazon() { return expCorazon; }
    public void setExpCorazon(List<String> expCorazon) { this.expCorazon = expCorazon; }
    public List<String> getExpAbdomen() { return expAbdomen; }
    public void setExpAbdomen(List<String> expAbdomen) { this.expAbdomen = expAbdomen; }
    public List<String> getExpExtremidades() { return expExtremidades; }
    public void setExpExtremidades(List<String> expExtremidades) { this.expExtremidades = expExtremidades; }
    public String getDiagnosticoCie10() { return diagnosticoCie10; }
    public void setDiagnosticoCie10(String diagnosticoCie10) { this.diagnosticoCie10 = diagnosticoCie10; }
    public String getRecomendacionesPlan() { return recomendacionesPlan; }
    public void setRecomendacionesPlan(String recomendacionesPlan) { this.recomendacionesPlan = recomendacionesPlan; }
    public String getMedicoNombre() { return medicoNombre; }
    public void setMedicoNombre(String medicoNombre) { this.medicoNombre = medicoNombre; }
    public String getMedicoCedula() { return medicoCedula; }
    public void setMedicoCedula(String medicoCedula) { this.medicoCedula = medicoCedula; }
}