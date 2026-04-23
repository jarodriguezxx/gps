package com.marakame.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

@Data
@ToString(exclude = {"articulos", "adjuntos"})
@EqualsAndHashCode(exclude = {"articulos", "adjuntos"})
@Entity
@Table(name = "requisiciones")
public class Requisicion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty("id")
    private UUID id;

    @JsonProperty("fecha")
    private OffsetDateTime fecha;

    @JsonProperty("area")
    private String area;

    @JsonProperty("solicitante")
    private String solicitante;

    @Convert(converter = EstadoConverter.class)
    @JsonProperty("estado")
    private Estado estado;

    @Enumerated(EnumType.STRING)
    @JsonProperty("tamanio")
    private TamanioCompra tamanio;

    @Enumerated(EnumType.STRING)
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

    @OneToMany(mappedBy = "requisicion", cascade = CascadeType.ALL)
    @JsonManagedReference("requisicion-articulos")
    @JsonProperty("articulos")
    private List<Articulo> articulos;

    @OneToMany(mappedBy = "requisicion", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AdjuntoRequisicion> adjuntos;
}
