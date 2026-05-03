package com.marakame.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class ActualizarOrdenCompraRequest {

    private String justificacion;
    private String proveedorId;
    private String proveedorNombre;
    private String proveedorRfc;
    private String proveedorTelefono;
    private String proveedorCorreo;
    private String proveedorContactoNombre;
    private List<ArticuloUpdate> articulos;

    public static class ArticuloUpdate {
        private String id;
        private String articulo;
        private String descripcion;
        private String unidad;
        private Integer cantidad;
        private BigDecimal precioUnitario;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getArticulo() { return articulo; }
        public void setArticulo(String articulo) { this.articulo = articulo; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
        public String getUnidad() { return unidad; }
        public void setUnidad(String unidad) { this.unidad = unidad; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    }

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
    public List<ArticuloUpdate> getArticulos() { return articulos; }
    public void setArticulos(List<ArticuloUpdate> articulos) { this.articulos = articulos; }
}
