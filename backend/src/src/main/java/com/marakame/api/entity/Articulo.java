package com.marakame.api.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@ToString(exclude = "requisicion")
@EqualsAndHashCode(exclude = "requisicion")
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
    private Integer articulosEntregados;

    @Column(name = "articulos_pendientes")
    @JsonProperty("articulosPendientes")
    private Integer articulosPendientes;
}