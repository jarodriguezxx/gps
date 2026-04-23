package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data; // <--- Asegúrate de tener esto
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

@Data // Genera Getters, Setters y Constructor (necesitas la librería Lombok)
@ToString(exclude = {"articulos", "adjuntos"})
@EqualsAndHashCode(exclude = {"articulos", "adjuntos"})
@Entity
@Table(name = "requisiciones")
public class Requisicion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private OffsetDateTime fecha;
    private String area;
    private String solicitante;

    @Convert(converter = EstadoConverter.class)
    private Estado estado;

    @Enumerated(EnumType.STRING)
    private TamanioCompra tamanio;

    @Enumerated(EnumType.STRING)
    private TipoCompra tipo;

    private String justificacion;

    @Column(name = "responsable_area")
    @JsonProperty("responsableArea") // Mapeo para el Frontend
    private String responsableArea;

    @Column(name = "sello_recibido")
    @JsonProperty("selloRecibido")
    private Boolean selloRecibido = false;

    // RELACIÓN: Una requisición tiene muchos artículos
    @OneToMany(mappedBy = "requisicion", cascade = CascadeType.ALL)
    @JsonManagedReference("requisicion-articulos")
    private List<Articulo> articulos;

    // RELACIÓN: Una requisición tiene muchos adjuntos
    @OneToMany(mappedBy = "requisicion", cascade = CascadeType.ALL)
    @JsonManagedReference("requisicion-adjuntos")
    private List<AdjuntoRequisicion> adjuntos;
}