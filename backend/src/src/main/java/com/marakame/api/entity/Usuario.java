package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "personal_id")
    private Personal personal;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonIgnore
    private String password;

    private String rol;

    @Column(columnDefinition = "boolean default true")
    private Boolean activo;

    private String fechaCreacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Personal getPersonal() { return personal; }
    public void setPersonal(Personal personal) { this.personal = personal; }

    public Long getPersonalId() { return personal != null ? personal.getId() : null; }

    public String getNombreCompleto() {
        if (personal == null) return null;
        return (personal.getNombre() + " " + personal.getApellidoPaterno() + " " + personal.getApellidoMaterno()).trim();
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    @JsonIgnore
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public boolean isActivo() { return activo == null || activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public String getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(String fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
