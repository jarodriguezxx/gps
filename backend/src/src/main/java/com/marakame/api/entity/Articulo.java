package com.marakame.api.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "articulos_requisicion")
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty("id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "requisicion_id")
    @JsonBackReference("requisicion-articulos")
    private Requisicion requisicion;

    @Column(name = "articulo_requisitado")
    @JsonProperty("articuloRequisitado")
    private String articuloRequisitado;

    @Enumerated(EnumType.STRING)
    @JsonProperty("unidad")
    private UnidadesArticulos unidad;

    @Column(name = "articulos_solicitados")
    @JsonProperty("articulosSolicitados")
    private Integer articulosSolicitados;


    @Column(name = "articulos_entregados")
    @JsonProperty("articulosEntregados")
    private Integer articulosEntregados = 0;

    @Column(name = "articulos_pendientes", insertable = false, updatable = false)
    @JsonProperty("articulosPendientes")
    private Integer articulosPendientes;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    @JsonProperty("descripcion")
    private String descripcion;

    @Column(name = "precio_unitario")
    @JsonProperty("precioUnitario")
    private Double precioUnitario;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Requisicion getRequisicion() { return requisicion; }
    public void setRequisicion(Requisicion requisicion) { this.requisicion = requisicion; }

    public String getArticuloRequisitado() { return articuloRequisitado; }
    public void setArticuloRequisitado(String articuloRequisitado) { this.articuloRequisitado = articuloRequisitado; }

    public UnidadesArticulos getUnidad() { return unidad; }
    public void setUnidad(UnidadesArticulos unidad) { this.unidad = unidad; }

    public Integer getArticulosSolicitados() { return articulosSolicitados; }
    public void setArticulosSolicitados(Integer articulosSolicitados) { this.articulosSolicitados = articulosSolicitados; }

    public Integer getArticulosEntregados() { return articulosEntregados; }
    public void setArticulosEntregados(Integer articulosEntregados) { this.articulosEntregados = articulosEntregados; }

    public Integer getArticulosPendientes() { return articulosPendientes; }
    public void setArticulosPendientes(Integer articulosPendientes) { this.articulosPendientes = articulosPendientes; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}