package com.marakame.api.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellido_paterno")
    private String apellidoPaterno;

    @Column(name = "apellido_materno")
    private String apellidoMaterno;

    @Column(name = "fecha_nacimiento")
    private String fechaNacimiento;

    @Column(name = "sexo")
    private String sexo;

    @Column(name = "edad")
    private Integer edad;

    @Column(name = "estado_civil")
    private String estadoCivil;

    @Column(name = "cantidad_hijos")
    private Integer cantidadHijos;

    @Column(name = "escolaridad")
    private String escolaridad;

    @Column(name = "origen")
    private String origen;

    @Column(name = "direccion_calle")
    private String direccionCalle;

    @Column(name = "direccion_no_ext")
    private String direccionNoExt;

    @Column(name = "direccion_no_int")
    private String direccionNoInt;

    @Column(name = "direccion_colonia")
    private String direccionColonia;

    @Column(name = "direccion_municipio_delegacion")
    private String direccionMunicipioDelegacion;

    @Column(name = "direccion_cp")
    private String direccionCp;

    @Column(name = "direccion_ciudad_estado")
    private String direccionCiudadEstado;

    @Column(name = "domicilio_particular")
    private String domicilioParticular;

    @Column(name = "telefono_casa")
    private String telefonoCasa;

    @Column(name = "telefono_contacto")
    private String telefonoContacto;

    @Column(name = "ocupacion")
    private String ocupacion;

    @Column(name = "sustancia_consumo")
    private String sustanciaConsumo;

    @Column(name = "estado_paciente")
    @Enumerated(EnumType.STRING)
    private EstadoPaciente estadoPaciente = EstadoPaciente.PROSPECTO;

    @Column(name = "clave_paciente", unique = true)
    private String clavePaciente;

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    @Column(name = "pago_validado")
    private Boolean pagoValidado = false;

    @Column(name = "fecha_validacion_pago")
    private LocalDateTime fechaValidacion;

    @Column(name = "folio_recibo")
    private String folioRecibo;

    @Column(name = "fecha_registro_recibo")
    private LocalDateTime fechaRegistroRecibo;

    @ManyToOne
    @JoinColumn(name = "solicitante_id")
    private Solicitante solicitante;

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

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
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

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
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

    public String getDireccionCp() {
        return direccionCp;
    }

    public void setDireccionCp(String direccionCp) {
        this.direccionCp = direccionCp;
    }

    public String getDireccionCiudadEstado() {
        return direccionCiudadEstado;
    }

    public void setDireccionCiudadEstado(String direccionCiudadEstado) {
        this.direccionCiudadEstado = direccionCiudadEstado;
    }

    public String getDireccionMunicipioDelegacion() {
        return direccionMunicipioDelegacion;
    }

    public void setDireccionMunicipioDelegacion(String direccionMunicipioDelegacion) {
        this.direccionMunicipioDelegacion = direccionMunicipioDelegacion;
    }

    public String getDomicilioParticular() {
        return domicilioParticular;
    }

    public void setDomicilioParticular(String domicilioParticular) {
        this.domicilioParticular = domicilioParticular;
    }

    public String getTelefonoCasa() {
        return telefonoCasa;
    }

    public void setTelefonoCasa(String telefonoCasa) {
        this.telefonoCasa = telefonoCasa;
    }

    public String getTelefonoContacto() {
        return telefonoContacto;
    }

    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
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

    public Solicitante getSolicitante() {
        return solicitante;
    }

    public void setSolicitante(Solicitante solicitante) {
        this.solicitante = solicitante;
    }

    public EstadoPaciente getEstadoPaciente() {
        return estadoPaciente;
    }

    public void setEstadoPaciente(EstadoPaciente estadoPaciente) {
        this.estadoPaciente = estadoPaciente;
    }

    public String getClavePaciente() {
        return clavePaciente;
    }

    public void setClavePaciente(String clavePaciente) {
        this.clavePaciente = clavePaciente;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public Boolean getPagoValidado() {
        return pagoValidado;
    }

    public void setPagoValidado(Boolean pagoValidado) {
        this.pagoValidado = pagoValidado;
    }

    public LocalDateTime getFechaValidacion() {
        return fechaValidacion;
    }

    public void setFechaValidacion(LocalDateTime fechaValidacion) {
        this.fechaValidacion = fechaValidacion;
    }

    public String getFolioRecibo() {
        return folioRecibo;
    }

    public void setFolioRecibo(String folioRecibo) {
        this.folioRecibo = folioRecibo;
    }

    public LocalDateTime getFechaRegistroRecibo() {
        return fechaRegistroRecibo;
    }

    public void setFechaRegistroRecibo(LocalDateTime fechaRegistroRecibo) {
        this.fechaRegistroRecibo = fechaRegistroRecibo;
    }
}
