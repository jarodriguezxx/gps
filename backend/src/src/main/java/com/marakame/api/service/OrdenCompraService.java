package com.marakame.api.service;

import com.marakame.api.dto.ActualizarOrdenCompraRequest;
import com.marakame.api.entity.*;
import com.marakame.api.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrdenCompraService {

    @Autowired
    private OrdenCompraRepository ordenCompraRepository;

    @Autowired
    private ArticuloOrdenCompraRepository articuloOrdenCompraRepository;

    @Autowired
    private RequisicionRepository requisicionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public OrdenCompra crearBorrador(UUID requisicionId) {
        Requisicion req = requisicionRepository.findById(requisicionId)
                .orElseThrow(NoSuchElementException::new);

        OrdenCompra orden = new OrdenCompra();
        orden.setRequisicion(req);
        orden.setFechaOrden(OffsetDateTime.now());
        orden.setEstatus("BORRADOR");
        orden.setJustificacion(req.getJustificacion());

        List<ArticuloOrdenCompra> articulos = new ArrayList<>();
        if (req.getArticulos() != null) {
            for (Articulo art : req.getArticulos()) {
                ArticuloOrdenCompra aoc = new ArticuloOrdenCompra();
                aoc.setOrdenCompra(orden);
                aoc.setArticuloRequisicionId(art.getId());
                aoc.setArticulo(art.getArticuloRequisitado());
                aoc.setDescripcion(art.getArticuloRequisitado());
                if (art.getUnidad() != null) {
                    try { aoc.setUnidad(UnidadesArticulos.valueOf(art.getUnidad())); } catch (IllegalArgumentException ignored) {}
                }
                aoc.setCantidad(art.getArticulosPendientes() != null ? art.getArticulosPendientes() : 0);
                aoc.setPrecioUnitario(BigDecimal.ZERO);
                articulos.add(aoc);
            }
        }
        orden.setArticulos(articulos);

        return ordenCompraRepository.save(orden);
    }

    public Optional<OrdenCompra> obtenerPorRequisicion(UUID requisicionId) {
        return ordenCompraRepository.findFirstByRequisicion_Id(requisicionId);
    }

    @Transactional
    public OrdenCompra actualizar(UUID id, ActualizarOrdenCompraRequest req) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        orden.setJustificacion(req.getJustificacion());
        orden.setProveedorId(req.getProveedorId());
        orden.setProveedorNombre(req.getProveedorNombre());
        orden.setProveedorRfc(req.getProveedorRfc());
        orden.setProveedorTelefono(req.getProveedorTelefono());
        orden.setProveedorCorreo(req.getProveedorCorreo());
        orden.setProveedorContactoNombre(req.getProveedorContactoNombre());

        if (req.getArticulos() != null) {
            for (ActualizarOrdenCompraRequest.ArticuloUpdate au : req.getArticulos()) {
                UUID artId = UUID.fromString(au.getId());
                articuloOrdenCompraRepository.findById(artId).ifPresent(aoc -> {
                    aoc.setArticulo(au.getArticulo());
                    aoc.setDescripcion(au.getDescripcion());
                    if (au.getUnidad() != null) {
                        try {
                            aoc.setUnidad(UnidadesArticulos.valueOf(au.getUnidad()));
                        } catch (IllegalArgumentException ignored) {}
                    }
                    if (au.getCantidad() != null) aoc.setCantidad(au.getCantidad());
                    if (au.getPrecioUnitario() != null) aoc.setPrecioUnitario(au.getPrecioUnitario());
                    articuloOrdenCompraRepository.save(aoc);
                });
            }
        }

        return ordenCompraRepository.save(orden);
    }

    @Transactional
    public OrdenCompra firmarEncargado(UUID id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(NoSuchElementException::new);
        orden.setFirmaEncargadoCompras(true);
        return ordenCompraRepository.save(orden);
    }

    @Transactional
    public OrdenCompra enviar(UUID id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(NoSuchElementException::new);
        Requisicion req = orden.getRequisicion();

        if (!Boolean.TRUE.equals(orden.getFirmaEncargadoCompras()))
            throw new IllegalStateException("firma-encargado-requerida");
        if (!Boolean.TRUE.equals(req.getFirmaAdministradora()))
            throw new IllegalStateException("firma-administradora-requerida");
        if (!Boolean.TRUE.equals(req.getFirmaDirectoraGral()))
            throw new IllegalStateException("firma-directora-requerida");
        if (orden.getProveedorId() == null)
            throw new IllegalStateException("proveedor-requerido");
        if (orden.getJustificacion() == null || orden.getJustificacion().isBlank())
            throw new IllegalStateException("justificacion-requerida");
        for (ArticuloOrdenCompra art : orden.getArticulos()) {
            if (art.getPrecioUnitario() == null || art.getPrecioUnitario().compareTo(BigDecimal.ZERO) <= 0)
                throw new IllegalStateException("precio-unitario-requerido");
        }

        Number cons = (Number) entityManager
                .createNativeQuery("SELECT nextval('ordenes_compra_consecutivo_seq')")
                .getSingleResult();
        orden.setConsecutivo(cons.intValue());
        orden.setNumeroOrden("OC-" + Year.now().getValue() + "-" + String.format("%04d", cons.intValue()));
        orden.setEstatus("ENVIADA");
        if (req.getTipo() == TipoCompra.ORDINARIA) {
            if (req.getTamanio() != TamanioCompra.MAYOR) {
                req.setEstado(Estado.FINALIZADA);
            }
            // MAYOR: estado queda en AUTORIZADA; compras sube cotizaciones + factura antes de finalizar
        } else if (req.getTipo() == TipoCompra.EXTRAORDINARIA) {
            req.setEstado(Estado.EN_REVISION);
        } else {
            req.setEstado(Estado.FINALIZADA);
        }
        requisicionRepository.save(req);

        return ordenCompraRepository.save(orden);
    }
}
