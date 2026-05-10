package com.marakame.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "salidas_almacen")
public class SalidaAlmacen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "articulo_nombre")
    private String articuloNombre;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "area_destino")
    private String areaDestino;

    @Column(name = "quien_recibe")
    private String quienRecibe;

    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;

    @PrePersist
    protected void onCreate() {
        fechaSalida = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getArticuloNombre() { return articuloNombre; }
    public void setArticuloNombre(String articuloNombre) { this.articuloNombre = articuloNombre; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getAreaDestino() { return areaDestino; }
    public void setAreaDestino(String areaDestino) { this.areaDestino = areaDestino; }

    public String getQuienRecibe() { return quienRecibe; }
    public void setQuienRecibe(String quienRecibe) { this.quienRecibe = quienRecibe; }

    public LocalDateTime getFechaSalida() { return fechaSalida; }
    public void setFechaSalida(LocalDateTime fechaSalida) { this.fechaSalida = fechaSalida; }
}