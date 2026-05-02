package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ordenes_compra")
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty("id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "requisicion_id")
    @JsonIgnore
    private Requisicion requisicion;

    @Column(name = "numero_orden")
    @JsonProperty("numeroOrden")
    private String numeroOrden;

    @Column(name = "consecutivo")
    @JsonProperty("consecutivo")
    private Integer consecutivo;

    @Column(name = "fecha_orden")
    @JsonProperty("fechaOrden")
    private OffsetDateTime fechaOrden;

    @Column(name = "estatus")
    @JsonProperty("estatus")
    private String estatus = "BORRADOR";

    @Column(name = "justificacion", columnDefinition = "TEXT")
    @JsonProperty("justificacion")
    private String justificacion;

    @Column(name = "proveedor_id")
    @JsonProperty("proveedorId")
    private String proveedorId;

    @Column(name = "proveedor_nombre")
    @JsonProperty("proveedorNombre")
    private String proveedorNombre;

    @Column(name = "proveedor_rfc")
    @JsonProperty("proveedorRfc")
    private String proveedorRfc;

    @Column(name = "proveedor_telefono")
    @JsonProperty("proveedorTelefono")
    private String proveedorTelefono;

    @Column(name = "proveedor_correo")
    @JsonProperty("proveedorCorreo")
    private String proveedorCorreo;

    @Column(name = "proveedor_contacto_nombre")
    @JsonProperty("proveedorContactoNombre")
    private String proveedorContactoNombre;

    @Column(name = "firma_encargado_compras")
    @JsonProperty("firmaEncargadoCompras")
    private Boolean firmaEncargadoCompras = false;

    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @JsonProperty("articulos")
    private List<ArticuloOrdenCompra> articulos = new ArrayList<>();

    @Transient
    @JsonProperty("requisicionId")
    public UUID getRequisicionId() {
        return requisicion != null ? requisicion.getId() : null;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Requisicion getRequisicion() { return requisicion; }
    public void setRequisicion(Requisicion requisicion) { this.requisicion = requisicion; }

    public String getNumeroOrden() { return numeroOrden; }
    public void setNumeroOrden(String numeroOrden) { this.numeroOrden = numeroOrden; }

    public Integer getConsecutivo() { return consecutivo; }
    public void setConsecutivo(Integer consecutivo) { this.consecutivo = consecutivo; }

    public OffsetDateTime getFechaOrden() { return fechaOrden; }
    public void setFechaOrden(OffsetDateTime fechaOrden) { this.fechaOrden = fechaOrden; }

    public String getEstatus() { return estatus; }
    public void setEstatus(String estatus) { this.estatus = estatus; }

    public String getJustificacion() { return justificacion; }
    public void setJustificacion(String justificacion) { this.justificacion = justificacion; }

    public String getProveedorId() { return proveedorId; }
    public void setProveedorId(String proveedorId) { this.proveedorId = proveedorId; }

    public String getProveedorNombre() { return proveedorNombre; }
    public void setProveedorNombre(String proveedorNombre) { this.proveedorNombre = proveedorNombre; }

    public String getProveedorRfc() { return proveedorRfc; }
    public void setProveedorRfc(String proveedorRfc) { this.proveedorRfc = proveedorRfc; }

    public String getProveedorTelefono() { return proveedorTelefono; }
    public void setProveedorTelefono(String proveedorTelefono) { this.proveedorTelefono = proveedorTelefono; }

    public String getProveedorCorreo() { return proveedorCorreo; }
    public void setProveedorCorreo(String proveedorCorreo) { this.proveedorCorreo = proveedorCorreo; }

    public String getProveedorContactoNombre() { return proveedorContactoNombre; }
    public void setProveedorContactoNombre(String proveedorContactoNombre) { this.proveedorContactoNombre = proveedorContactoNombre; }

    public Boolean getFirmaEncargadoCompras() { return firmaEncargadoCompras; }
    public void setFirmaEncargadoCompras(Boolean firmaEncargadoCompras) { this.firmaEncargadoCompras = firmaEncargadoCompras; }

    public List<ArticuloOrdenCompra> getArticulos() { return articulos; }
    public void setArticulos(List<ArticuloOrdenCompra> articulos) { this.articulos = articulos; }
}
