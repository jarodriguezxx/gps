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
    private UUID id;

    // Unión con el padre
    @ManyToOne
    @JoinColumn(name = "requisicion_id")
    @JsonBackReference("requisicion-articulos")
    private Requisicion requisicion;

    @Column(name = "articulo_requisitado")
    @JsonProperty("articuloRequisitado")
    private String articuloRequisitado;

    @Enumerated(EnumType.STRING)
    private UnidadesArticulos unidad;

    @Column(name = "articulos_solicitados")
    private Integer articulosSolicitados;
}