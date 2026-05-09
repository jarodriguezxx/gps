package com.marakame.api.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "articulos_requisicion")
public class ArticuloRequisicion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "requisicion_id", nullable = false)
    private UUID requisicionId;

    @Column(name = "articulo_requisitado", nullable = false)
    private String articuloRequisitado;

    @Column(name = "unidad", nullable = false)
    private String unidad;

    @Column(name = "articulos_solicitados", columnDefinition = "integer default 0")
    private Integer articulosSolicitados;

    @Column(name = "articulos_entregados", columnDefinition = "integer default 0")
    private Integer articulosEntregados;

    // Como este campo es generado automáticamente por PostgreSQL (STORED), 
    // le decimos a Java que no intente insertarlo ni actualizarlo.
    @Column(name = "articulos_pendientes", insertable = false, updatable = false)
    private Integer articulosPendientes;


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRequisicionId() { return requisicionId; }
    public void setRequisicionId(UUID requisicionId) { this.requisicionId = requisicionId; }

    public String getArticuloRequisitado() { return articuloRequisitado; }
    public void setArticuloRequisitado(String articuloRequisitado) { this.articuloRequisitado = articuloRequisitado; }

    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }

    public Integer getArticulosSolicitados() { return articulosSolicitados; }
    public void setArticulosSolicitados(Integer articulosSolicitados) { this.articulosSolicitados = articulosSolicitados; }

    public Integer getArticulosEntregados() { return articulosEntregados; }
    public void setArticulosEntregados(Integer articulosEntregados) { this.articulosEntregados = articulosEntregados; }

    public Integer getArticulosPendientes() { return articulosPendientes; }
    public void setArticulosPendientes(Integer articulosPendientes) { this.articulosPendientes = articulosPendientes; }
}