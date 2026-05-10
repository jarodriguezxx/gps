package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

@Entity
@Table(name = "requisiciones")
public class Requisicion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty("id")
    private UUID id;

    @Column(name = "fecha")
    @JsonProperty("fecha")
    private OffsetDateTime fecha = OffsetDateTime.now();

    @JsonProperty("area")
    private String area;

    @JsonProperty("solicitante")
    private String solicitante;

    @Convert(converter = EstadoConverter.class)
    @JsonProperty("estado")
    private Estado estado;

    @Convert(converter = TamanioCompraConverter.class)
    @JsonProperty("tamanio")
    private TamanioCompra tamanio;

    @Convert(converter = TipoCompraConverter.class)
    @JsonProperty("tipo")
    private TipoCompra tipo;

    @JsonProperty("justificacion")
    private String justificacion;

    @Column(name = "responsable_area")
    @JsonProperty("responsableArea")
    private String responsableArea;

    @Column(name = "sello_recibido")
    @JsonProperty("selloRecibido")
    private Boolean selloRecibido = false;

    @Column(name = "firma_responsable_area")
    @JsonProperty("firmaDeResponsableArea")
    private Boolean firmaResponsableArea = false;

    @Column(name = "firma_administradora")
    @JsonProperty("firmaAdminsitradora")
    private Boolean firmaAdministradora = false;

    @Column(name = "firma_directora_gral")
    @JsonProperty("firmaDirectoraGral")
    private Boolean firmaDirectoraGral = false;

    @Column(name = "cotizacion_path")
    @JsonProperty("cotizacionPath")
    private String cotizacionPath;

    @Column(name = "factura_path")
    @JsonProperty("facturaPath")
    private String facturaPath;

    @OneToMany(mappedBy = "requisicion", cascade = CascadeType.ALL)
    @JsonManagedReference("requisicion-articulos")
    @JsonProperty("articulos")
    private List<Articulo> articulos;

    @OneToMany(mappedBy = "requisicion", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AdjuntoRequisicion> adjuntos;

    // Getters y setters explícitos (Lombok incompatible con este JDK)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public OffsetDateTime getFecha() { return fecha; }
    public void setFecha(OffsetDateTime fecha) { this.fecha = fecha; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getSolicitante() { return solicitante; }
    public void setSolicitante(String solicitante) { this.solicitante = solicitante; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public TamanioCompra getTamanio() { return tamanio; }
    public void setTamanio(TamanioCompra tamanio) { this.tamanio = tamanio; }

    public TipoCompra getTipo() { return tipo; }
    public void setTipo(TipoCompra tipo) { this.tipo = tipo; }

    public String getJustificacion() { return justificacion; }
    public void setJustificacion(String justificacion) { this.justificacion = justificacion; }

    public String getResponsableArea() { return responsableArea; }
    public void setResponsableArea(String responsableArea) { this.responsableArea = responsableArea; }

    public Boolean getSelloRecibido() { return selloRecibido; }
    public void setSelloRecibido(Boolean selloRecibido) { this.selloRecibido = selloRecibido; }

    public Boolean getFirmaResponsableArea() { return firmaResponsableArea; }
    public void setFirmaResponsableArea(Boolean firmaResponsableArea) { this.firmaResponsableArea = firmaResponsableArea; }

    @JsonProperty("firmaAdminsitradora")
    public Boolean getFirmaAdministradora() { return firmaAdministradora; }
    public void setFirmaAdministradora(Boolean firmaAdministradora) { this.firmaAdministradora = firmaAdministradora; }

    public Boolean getFirmaDirectoraGral() { return firmaDirectoraGral; }
    public void setFirmaDirectoraGral(Boolean firmaDirectoraGral) { this.firmaDirectoraGral = firmaDirectoraGral; }

    public String getCotizacionPath() { return cotizacionPath; }
    public void setCotizacionPath(String cotizacionPath) { this.cotizacionPath = cotizacionPath; }

    public String getFacturaPath() { return facturaPath; }
    public void setFacturaPath(String facturaPath) { this.facturaPath = facturaPath; }

    public List<Articulo> getArticulos() { return articulos; }
    public void setArticulos(List<Articulo> articulos) { this.articulos = articulos; }

    public List<AdjuntoRequisicion> getAdjuntos() { return adjuntos; }
    public void setAdjuntos(List<AdjuntoRequisicion> adjuntos) { this.adjuntos = adjuntos; }
}
