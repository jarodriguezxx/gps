package com.marakame.api.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitantes")
public class Solicitante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombres")
    private String nombres;
    @Column(name = "apellido_paterno")
    private String apellidoPaterno;
    @Column(name = "apellido_materno")
    private String apellidoMaterno;
    private String nombre;
    @Column(name = "fecha_nacimiento")
    private String fechaNacimiento;
    private Integer edad;
    private String sexo;
    private String escolaridad;
    @Column(name = "estado_civil")
    private String estadoCivil;
    private String lugar;
    private String ocupacion;
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
    private String domicilioParticular;
    private String parentescoPaciente;
    private String telefono;
    private String celular;
    @Column(name = "cuenta_con_tarjeta")
    private String cuentaConTarjeta;

    @Column(name = "fuente_referencia")
    private String fuenteReferencia;

    @Column(name = "fuente_referencia_otro")
    private String fuenteReferenciaOtro;

    // Getters y Setters...
    // Getter para leer el ID
    public Long getId() {
        return id;
    }

    // Setter para modificar el ID
    public void setId(Long id) {
        this.id = id;
    }

    // Getter para leer el nombre
    public String getNombre() {
        return nombre;
    }

    // Setter para modificar el nombre
    public void setNombre(String nombre) {
        this.nombre = nombre;


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

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getEscolaridad() {
        return escolaridad;
    }

    public void setEscolaridad(String escolaridad) {
        this.escolaridad = escolaridad;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    // Getter para leer el lugar
    public String getLugar() {
        return lugar;
    }

    // Setter para modificar el lugar
    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    // Getter para leer la ocupacion
    public String getOcupacion() {
        return ocupacion;
    }

    // Setter para modificar la ocupacion
    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
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

    public String getDireccionMunicipioDelegacion() {
        return direccionMunicipioDelegacion;
    }

    public void setDireccionMunicipioDelegacion(String direccionMunicipioDelegacion) {
        this.direccionMunicipioDelegacion = direccionMunicipioDelegacion;
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

    // Getter para leer el domicilioParticular
    public String getDomicilioParticular() {
        return domicilioParticular;
    }

    // Setter para modificar el domicilioParticular
    public void setDomicilioParticular(String domicilioParticular) {
        this.domicilioParticular = domicilioParticular;
    }

    // Getter para leer el parentescoPaciente
    public String getParentescoPaciente() {
        return parentescoPaciente;
    }

    // Setter para modificar el parentescoPaciente
    public void setParentescoPaciente(String parentescoPaciente) {
        this.parentescoPaciente = parentescoPaciente;
    }

    // Getter para leer el telefono
    public String getTelefono() {
        return telefono;
    }

    // Setter para modificar el telefono
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    // Getter para leer el celular
    public String getCelular() {
        return celular;
    }

    // Setter para modificar el celular
    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getCuentaConTarjeta() {
        return cuentaConTarjeta;
    }

    public void setCuentaConTarjeta(String cuentaConTarjeta) {
        this.cuentaConTarjeta = cuentaConTarjeta;
    }

    public String getFuenteReferencia() {
        return fuenteReferencia;
    }

    public void setFuenteReferencia(String fuenteReferencia) {
        this.fuenteReferencia = fuenteReferencia;
    }

    public String getFuenteReferenciaOtro() {
        return fuenteReferenciaOtro;
    }

    public void setFuenteReferenciaOtro(String fuenteReferenciaOtro) {
        this.fuenteReferenciaOtro = fuenteReferenciaOtro;
    }

}