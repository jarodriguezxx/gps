package com.marakame.api.entity;
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

    private String nombre;
    private String lugar;
    private String ocupacion;
    private String domicilioParticular;
    private String parentescoPaciente;
    private String telefono;
    private String celular;

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

}