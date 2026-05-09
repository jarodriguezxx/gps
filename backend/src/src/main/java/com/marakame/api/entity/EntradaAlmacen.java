package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "entradas_almacen")
public class EntradaAlmacen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String folio; // Ej: ENT-0090

    @Column(name = "fecha_recepcion")
    private LocalDateTime fechaRecepcion;

    private String proveedor;
    
    @Column(name = "numero_factura")
    private String numeroFactura;
    
    @Column(name = "monto_factura")
    private BigDecimal montoFactura;
    
    private String descripcion;
    
    @Column(name = "cantidad_recibida")
    private Integer cantidadRecibida;
    
    @Column(name = "unidad_medida")
    private String unidadMedida; // Tabletas, Frascos, Cajas...
    
    @Column(name = "orden_compra_ref")
    private String ordenCompraRef;
    
    @Column(name = "requisicion_ref")
    private String requisicionRef;

    private String estado; // Ej: "EN_REVISION", "ACEPTADO", "DEVUELTO"

    // Constructor vacío
    public EntradaAlmacen() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }

    public LocalDateTime getFechaRecepcion() { return fechaRecepcion; }
    public void setFechaRecepcion(LocalDateTime fechaRecepcion) { this.fechaRecepcion = fechaRecepcion; }

    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }

    public BigDecimal getMontoFactura() { return montoFactura; }
    public void setMontoFactura(BigDecimal montoFactura) { this.montoFactura = montoFactura; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getCantidadRecibida() { return cantidadRecibida; }
    public void setCantidadRecibida(Integer cantidadRecibida) { this.cantidadRecibida = cantidadRecibida; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public String getOrdenCompraRef() { return ordenCompraRef; }
    public void setOrdenCompraRef(String ordenCompraRef) { this.ordenCompraRef = ordenCompraRef; }

    public String getRequisicionRef() { return requisicionRef; }
    public void setRequisicionRef(String requisicionRef) { this.requisicionRef = requisicionRef; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}