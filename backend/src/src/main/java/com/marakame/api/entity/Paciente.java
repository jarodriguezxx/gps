package com.marakame.api.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pacientes")
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCompleto;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String nombres;
    private Integer edad;
    private String estadoCivil;
    private Integer cantidadHijos;
    private String escolaridad;
    private String origen;
    private String domicilioParticular;
    private String telefonoContacto;
    private String telefonoCasa;
    private String ocupacion;
    private String sustanciaConsumo;
    private String sexo;
    private String fechaNacimiento;
    
    // Campos de dirección
    private String direccionCalle;
    private String direccionNoExt;
    private String direccionNoInt;
    private String direccionColonia;
    private String direccionCP;
    private String direccionMunicipioDelegacion;
    private String direccionCiudadEstado;

    // Relación: Un paciente tiene un solicitante que hizo el trámite
    @ManyToOne
    @JoinColumn(name = "solicitante_id")
    private Solicitante solicitante;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(String apellidoPaterno) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(String apellidoMaterno) {
        this.apellidoMaterno = apellidoMaterno;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public Integer getCantidadHijos() {
        return cantidadHijos;
    }

    public void setCantidadHijos(Integer cantidadHijos) {
        this.cantidadHijos = cantidadHijos;
    }

    public String getEscolaridad() {
        return escolaridad;
    }

    public void setEscolaridad(String escolaridad) {
        this.escolaridad = escolaridad;
    }

    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getDomicilioParticular() {
        return domicilioParticular;
    }
    
    public void setDomicilioParticular(String domicilioParticular) {
        this.domicilioParticular = domicilioParticular;
    }

    public String getTelefonoContacto() {
        return telefonoContacto;
    }

    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }

    public String getTelefonoCasa() {
        return telefonoCasa;
    }

    public void setTelefonoCasa(String telefonoCasa) {
        this.telefonoCasa = telefonoCasa;
    }

    public String getOcupacion() {
        return ocupacion;
    }

    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
    }

    public String getSustanciaConsumo() {
        return sustanciaConsumo;
    }

    public void setSustanciaConsumo(String sustanciaConsumo) {
        this.sustanciaConsumo = sustanciaConsumo;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getDireccionCalle() {
        return direccionCalle;
    }

    public void setDireccionCalle(String direccionCalle) {
        this.direccionCalle = direccionCalle;
    }

    public String getDireccionNoExt() {
        return direccionNoExt;
    }

    public void setDireccionNoExt(String direccionNoExt) {
        this.direccionNoExt = direccionNoExt;
    }

    public String getDireccionNoInt() {
        return direccionNoInt;
    }

    public void setDireccionNoInt(String direccionNoInt) {
        this.direccionNoInt = direccionNoInt;
    }

    public String getDireccionColonia() {
        return direccionColonia;
    }

    public void setDireccionColonia(String direccionColonia) {
        this.direccionColonia = direccionColonia;
    }

    public String getDireccionCP() {
        return direccionCP;
    }

    public void setDireccionCP(String direccionCP) {
        this.direccionCP = direccionCP;
    }

    public String getDireccionMunicipioDelegacion() {
        return direccionMunicipioDelegacion;
    }

    public void setDireccionMunicipioDelegacion(String direccionMunicipioDelegacion) {
        this.direccionMunicipioDelegacion = direccionMunicipioDelegacion;
    }

    public String getDireccionCiudadEstado() {
        return direccionCiudadEstado;
    }

    public void setDireccionCiudadEstado(String direccionCiudadEstado) {
        this.direccionCiudadEstado = direccionCiudadEstado;
    }

    public Solicitante getSolicitante() {
        return solicitante;
    }

    public void setSolicitante(Solicitante solicitante) {
        this.solicitante = solicitante;
    }
}