package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inventario_almacen")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_barras", unique = true)
    private String codigoBarras; // Opcional, para escaneo rápido

    @Column(name = "nombre_articulo", nullable = false)
    private String nombreArticulo; // Ej. "Tóner HP 58A"

    private String categoria; // Ej. "TI", "Limpieza", "Papelería", "Médico"

    @Column(name = "unidad_medida")
    private String unidadMedida; // Ej. "PIEZA", "CAJA", "PAQUETE"

    @Column(name = "cantidad_disponible", nullable = false)
    private Integer cantidadDisponible;

    @Column(name = "nivel_minimo_alerta")
    private Integer nivelMinimoAlerta; // Para avisar cuando quede poco stock

    // --- Datos del Paso 6 (Ubicación) ---
    @Column(name = "zona_almacen")
    private String zonaAlmacen; // Ej. "A", "B", "Refrigeración"
    
    private String estante; // Ej. "Estante 3, Nivel 2"

    // --- Datos Clínicos / Perecederos ---
    private String lote;
    
    @Column(name = "fecha_caducidad")
    private LocalDate fechaCaducidad;

    public Inventario() {}

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getNombreArticulo() { return nombreArticulo; }
    public void setNombreArticulo(String nombreArticulo) { this.nombreArticulo = nombreArticulo; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public Integer getCantidadDisponible() { return cantidadDisponible; }
    public void setCantidadDisponible(Integer cantidadDisponible) { this.cantidadDisponible = cantidadDisponible; }

    public Integer getNivelMinimoAlerta() { return nivelMinimoAlerta; }
    public void setNivelMinimoAlerta(Integer nivelMinimoAlerta) { this.nivelMinimoAlerta = nivelMinimoAlerta; }

    public String getZonaAlmacen() { return zonaAlmacen; }
    public void setZonaAlmacen(String zonaAlmacen) { this.zonaAlmacen = zonaAlmacen; }

    public String getEstante() { return estante; }
    public void setEstante(String estante) { this.estante = estante; }

    public String getLote() { return lote; }
    public void setLote(String lote) { this.lote = lote; }

    public LocalDate getFechaCaducidad() { return fechaCaducidad; }
    public void setFechaCaducidad(LocalDate fechaCaducidad) { this.fechaCaducidad = fechaCaducidad; }
}