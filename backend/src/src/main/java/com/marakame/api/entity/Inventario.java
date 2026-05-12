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

    // Campos para inventario médico y dispensación en enfermería
    // stockMedico: cantidad en unidades mínimas disponible en el área médica
    @Column(name = "stock_enfermeria")
    private Integer stockEnfermeria;

    // Factor de conversión: cuántas unidades mínimas contiene cada empaque normal
    // Ej: 1 caja = 30 pastillas  →  unidadesPorEmpaque = 30
    // Future: puede ligarse a una transferencia formal cuando se implemente ese flujo
    @Column(name = "unidades_por_empaque")
    private Integer unidadesPorEmpaque;

    // Nombre de la unidad mínima de dispensación (pastilla, ampolleta, ml, etc.)
    @Column(name = "unidad_minima")
    private String unidadMinima;

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

    public Integer getStockEnfermeria() { return stockEnfermeria; }
    public void setStockEnfermeria(Integer stockEnfermeria) { this.stockEnfermeria = stockEnfermeria; }

    public Integer getUnidadesPorEmpaque() { return unidadesPorEmpaque; }
    public void setUnidadesPorEmpaque(Integer unidadesPorEmpaque) { this.unidadesPorEmpaque = unidadesPorEmpaque; }

    public String getUnidadMinima() { return unidadMinima; }
    public void setUnidadMinima(String unidadMinima) { this.unidadMinima = unidadMinima; }
}