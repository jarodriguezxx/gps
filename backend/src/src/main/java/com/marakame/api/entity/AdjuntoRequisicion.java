package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.UUID;

@Data
@ToString(exclude = "requisicion")
@EqualsAndHashCode(exclude = "requisicion")
@Entity
@Table(name = "adjuntos_requisicion")
public class AdjuntoRequisicion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "requisicion_id")
    @JsonBackReference("requisicion-adjuntos")
    private Requisicion requisicion;

    private String nombreArchivo;
    private String rutaArchivo;
    private String tipoContenido;
}