package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inventario_almacen")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_articulo", nullable = false)
    private String nombreArticulo;

    @Column(name = "cantidad_disponible", nullable = false)
    private Integer cantidadDisponible;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "codigo_barras", unique = true)
    private String codigoBarras;

    @Column(name = "lote")
    private String lote;

    @Column(name = "fecha_caducidad")
    private LocalDate fechaCaducidad;

    @Column(name = "nivel_minimo_alerta")
    private Integer nivelMinimoAlerta;

    // Campos de ubicación física
    @Column(name = "zona_almacen")
    private String zonaAlmacen;

    @Column(name = "estante")
    private String estante;

    @Column(name = "cuidados_especiales")
    private String cuidadosEspeciales;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreArticulo() { return nombreArticulo; }
    public void setNombreArticulo(String nombreArticulo) { this.nombreArticulo = nombreArticulo; }

    public Integer getCantidadDisponible() { return cantidadDisponible; }
    public void setCantidadDisponible(Integer cantidadDisponible) { this.cantidadDisponible = cantidadDisponible; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getLote() { return lote; }
    public void setLote(String lote) { this.lote = lote; }

    public LocalDate getFechaCaducidad() { return fechaCaducidad; }
    public void setFechaCaducidad(LocalDate fechaCaducidad) { this.fechaCaducidad = fechaCaducidad; }

    public Integer getNivelMinimoAlerta() { return nivelMinimoAlerta; }
    public void setNivelMinimoAlerta(Integer nivelMinimoAlerta) { this.nivelMinimoAlerta = nivelMinimoAlerta; }

    public String getZonaAlmacen() { return zonaAlmacen; }
    public void setZonaAlmacen(String zonaAlmacen) { this.zonaAlmacen = zonaAlmacen; }

    public String getEstante() { return estante; }
    public void setEstante(String estante) { this.estante = estante; }

    public String getCuidadosEspeciales() { return cuidadosEspeciales; }
    public void setCuidadosEspeciales(String cuidadosEspeciales) { this.cuidadosEspeciales = cuidadosEspeciales; }
}