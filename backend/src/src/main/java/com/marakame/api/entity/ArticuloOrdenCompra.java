package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "articulos_orden_compra")
public class ArticuloOrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty("id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "orden_compra_id")
    @JsonBackReference
    private OrdenCompra ordenCompra;

    @Column(name = "articulo_requisicion_id")
    @JsonProperty("articuloRequisicionId")
    private UUID articuloRequisicionId;

    @Column(name = "articulo")
    @JsonProperty("articulo")
    private String articulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    @JsonProperty("descripcion")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @JsonProperty("unidad")
    private UnidadesArticulos unidad;

    @Column(name = "cantidad")
    @JsonProperty("cantidad")
    private Integer cantidad;

    @Column(name = "precio_unitario")
    @JsonProperty("precioUnitario")
    private BigDecimal precioUnitario = BigDecimal.ZERO;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public OrdenCompra getOrdenCompra() { return ordenCompra; }
    public void setOrdenCompra(OrdenCompra ordenCompra) { this.ordenCompra = ordenCompra; }

    public UUID getArticuloRequisicionId() { return articuloRequisicionId; }
    public void setArticuloRequisicionId(UUID articuloRequisicionId) { this.articuloRequisicionId = articuloRequisicionId; }

    public String getArticulo() { return articulo; }
    public void setArticulo(String articulo) { this.articulo = articulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public UnidadesArticulos getUnidad() { return unidad; }
    public void setUnidad(UnidadesArticulos unidad) { this.unidad = unidad; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}
