package com.marakame.api.service;

import com.marakame.api.entity.AdjuntoRequisicion;
import com.marakame.api.entity.Estado;
import com.marakame.api.entity.Requisicion;
import com.marakame.api.entity.TamanioCompra;
import com.marakame.api.entity.TipoCompra;
import com.marakame.api.repository.AdjuntoRepository;
import com.marakame.api.repository.RequisicionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.OffsetDateTime;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class RequisicionService {

    @Autowired
    RequisicionRepository repository;

    @Autowired
    AdjuntoRepository adjuntoRepository;

    @Value("${app.cotizaciones.dir}")
    String cotizacionesDir;

    public java.util.List<Requisicion> obtenerTodas() {
        return repository.findAll();
    }

    public Requisicion crear(Requisicion requisicion) {
    requisicion.setFecha(OffsetDateTime.now());
    return repository.save(requisicion);
    }

    public Optional<Requisicion> obtenerPorId(UUID id) {
        return repository.findById(id);
    }

    // ==========================================
    // NUEVO MÉTODO: Actualizar estado de requisición
    // ==========================================
    @Transactional
    public Requisicion actualizarEstado(UUID id, Estado nuevoEstado) {
        Requisicion req = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la requisición con ID: " + id));
        
        req.setEstado(nuevoEstado);
        return repository.save(req);
    }

    @Transactional
    public Requisicion enviar(UUID id) {
        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        if (req.getEstado() == Estado.PENDIENTE) {
            if (req.getTipo() == TipoCompra.EXTRAORDINARIA && req.getCotizacionPath() == null)
                throw new IllegalStateException("cotizacion-requerida");
            req.setEstado(Estado.PRE_AUTORIZADA);
        } else if (req.getEstado() == Estado.PRE_AUTORIZADA && req.getTipo() == TipoCompra.ORDINARIA) {
            if (adjuntoRepository.findByRequisicionId(id).isEmpty())
                throw new IllegalStateException("cotizacion-requerida");
            req.setEstado(Estado.EN_REVISION);
        } else if (req.getEstado() == Estado.AUTORIZADA
                && req.getTipo() == TipoCompra.ORDINARIA
                && req.getTamanio() == TamanioCompra.MAYOR) {
            if (adjuntoRepository.findByRequisicionIdAndTipo(id, "COTIZACION").size() < 3)
                throw new IllegalStateException("cotizacion-requerida");
            if (req.getFacturaPath() == null)
                throw new IllegalStateException("factura-requerida");
            req.setEstado(Estado.FINALIZADA);
        } else if (req.getEstado() == Estado.EN_REVISION
                && req.getTipo() == TipoCompra.EXTRAORDINARIA
                && req.getTamanio() == TamanioCompra.MENOR) {
            List<AdjuntoRequisicion> facturas = adjuntoRepository.findByRequisicionIdAndTipo(id, "FACTURA");
            if (facturas.isEmpty())
                throw new IllegalStateException("factura-requerida");
            req.setEstado(Estado.FINALIZADA);
        } else if (req.getEstado() == Estado.EN_REVISION
                && req.getTipo() == TipoCompra.EXTRAORDINARIA
                && req.getTamanio() == TamanioCompra.MAYOR) {
            List<AdjuntoRequisicion> cotizaciones = adjuntoRepository.findByRequisicionIdAndTipo(id, "COTIZACION");
            if (cotizaciones.size() < 3)
                throw new IllegalStateException("cotizacion-requerida");
            List<AdjuntoRequisicion> facturas = adjuntoRepository.findByRequisicionIdAndTipo(id, "FACTURA");
            if (facturas.isEmpty())
                throw new IllegalStateException("factura-requerida");
            req.setEstado(Estado.FINALIZADA);
        } else {
            throw new IllegalStateException("estado-invalido");
        }
        return repository.save(req);
    }

    @Transactional
    public Requisicion eliminarCotizacion(UUID id) throws IOException {
        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        if (req.getCotizacionPath() != null) {
            Files.deleteIfExists(Paths.get(req.getCotizacionPath()));
            req.setCotizacionPath(null);
        }
        return repository.save(req);
    }

    @Transactional
    public Requisicion guardarCotizacion(UUID id, MultipartFile archivo) throws IOException {
        if (!"application/pdf".equals(archivo.getContentType()))
            throw new IllegalArgumentException("solo-pdf");

        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        Path dir = Paths.get(cotizacionesDir);
        Files.createDirectories(dir);
        String filename = id + "_" + archivo.getOriginalFilename();
        Path dest = dir.resolve(filename);
        archivo.transferTo(dest);

        req.setCotizacionPath(dest.toAbsolutePath().toString());
        return repository.save(req);
    }

    @Transactional
    public AdjuntoRequisicion guardarAdjunto(UUID id, MultipartFile archivo) throws IOException {
        if (!"application/pdf".equals(archivo.getContentType()))
            throw new IllegalArgumentException("solo-pdf");

        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        boolean puedeSubirAdjunto =
                (req.getEstado() == Estado.PRE_AUTORIZADA && req.getTipo() == TipoCompra.ORDINARIA) ||
                (req.getEstado() == Estado.AUTORIZADA && req.getTipo() == TipoCompra.ORDINARIA
                        && req.getTamanio() == TamanioCompra.MAYOR) ||
                (req.getEstado() == Estado.EN_REVISION && req.getTipo() == TipoCompra.EXTRAORDINARIA
                        && req.getTamanio() == TamanioCompra.MAYOR);
        if (!puedeSubirAdjunto)
            throw new IllegalStateException("estado-invalido");

        if (adjuntoRepository.findByRequisicionIdAndTipo(id, "COTIZACION").size() >= 3)
            throw new IllegalStateException("maximo-cotizaciones");

        Path dir = Paths.get(cotizacionesDir);
        Files.createDirectories(dir);
        String filename = id + "_adj_" + System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        Path dest = dir.resolve(filename);
        archivo.transferTo(dest);

        AdjuntoRequisicion adjunto = new AdjuntoRequisicion();
        adjunto.setRequisicion(req);
        adjunto.setNombreArchivo(archivo.getOriginalFilename());
        adjunto.setNombreOriginal(archivo.getOriginalFilename());
        adjunto.setRutaArchivo(dest.toAbsolutePath().toString());
        adjunto.setTipoContenido(archivo.getContentType());
        adjunto.setTipo("COTIZACION");
        return adjuntoRepository.save(adjunto);
    }

    @Transactional
    public void eliminarAdjunto(UUID requisicionId, UUID adjuntoId) throws IOException {
        AdjuntoRequisicion adjunto = adjuntoRepository.findById(adjuntoId)
                .orElseThrow(NoSuchElementException::new);
        Files.deleteIfExists(Paths.get(adjunto.getRutaArchivo()));
        adjuntoRepository.delete(adjunto);
    }

    public List<AdjuntoRequisicion> listarAdjuntos(UUID id) {
        return adjuntoRepository.findByRequisicionId(id);
    }

    @Transactional
    public Requisicion guardarFactura(UUID id, MultipartFile archivo) throws IOException {
        if (!"application/pdf".equals(archivo.getContentType()))
            throw new IllegalArgumentException("solo-pdf");

        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        if (req.getEstado() != Estado.AUTORIZADA
                || req.getTipo() != TipoCompra.ORDINARIA
                || req.getTamanio() != TamanioCompra.MAYOR)
            throw new IllegalStateException("estado-invalido");

        Path dir = Paths.get(cotizacionesDir);
        Files.createDirectories(dir);
        String filename = id + "_factura_" + archivo.getOriginalFilename();
        Path dest = dir.resolve(filename);
        archivo.transferTo(dest);

        if (req.getFacturaPath() != null)
            Files.deleteIfExists(Paths.get(req.getFacturaPath()));

        req.setFacturaPath(dest.toAbsolutePath().toString());
        return repository.save(req);
    }

    @Transactional
    public Requisicion eliminarFactura(UUID id) throws IOException {
        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);
        if (req.getFacturaPath() != null) {
            Files.deleteIfExists(Paths.get(req.getFacturaPath()));
            req.setFacturaPath(null);
        }
        return repository.save(req);
    }

    @Transactional
    public AdjuntoRequisicion guardarAdjuntoFactura(UUID id, MultipartFile archivo) throws IOException {
        if (!"application/pdf".equals(archivo.getContentType()))
            throw new IllegalArgumentException("solo-pdf");

        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        if (req.getEstado() != Estado.EN_REVISION
                || req.getTipo() != TipoCompra.EXTRAORDINARIA
                || (req.getTamanio() != TamanioCompra.MENOR && req.getTamanio() != TamanioCompra.MAYOR))
            throw new IllegalStateException("estado-invalido");

        if (adjuntoRepository.findByRequisicionIdAndTipo(id, "FACTURA").size() >= 5)
            throw new IllegalStateException("maximo-facturas");

        Path dir = Paths.get(cotizacionesDir);
        Files.createDirectories(dir);
        String filename = id + "_factura_adj_" + System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        Path dest = dir.resolve(filename);
        archivo.transferTo(dest);

        AdjuntoRequisicion adjunto = new AdjuntoRequisicion();
        adjunto.setRequisicion(req);
        adjunto.setNombreArchivo(archivo.getOriginalFilename());
        adjunto.setNombreOriginal(archivo.getOriginalFilename());
        adjunto.setRutaArchivo(dest.toAbsolutePath().toString());
        adjunto.setTipoContenido(archivo.getContentType());
        adjunto.setTipo("FACTURA");
        return adjuntoRepository.save(adjunto);
    }

    public List<AdjuntoRequisicion> listarAdjuntosPorTipo(UUID id, String tipo) {
        return adjuntoRepository.findByRequisicionIdAndTipo(id, tipo);
    }
}