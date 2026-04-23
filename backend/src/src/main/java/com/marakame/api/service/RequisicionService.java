package com.marakame.api.service;

import com.marakame.api.entity.Estado;
import com.marakame.api.entity.Requisicion;
import com.marakame.api.entity.TipoCompra;
import com.marakame.api.repository.RequisicionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class RequisicionService {

    @Autowired
    RequisicionRepository repository;

    @Value("${app.cotizaciones.dir}")
    String cotizacionesDir;

    public java.util.List<Requisicion> obtenerTodas() {
        return repository.findAll();
    }

    public Requisicion crear(Requisicion requisicion) {
        return repository.save(requisicion);
    }

    public Optional<Requisicion> obtenerPorId(UUID id) {
        return repository.findById(id);
    }

    @Transactional
    public Requisicion enviar(UUID id) {
        Requisicion req = repository.findById(id)
                .orElseThrow(NoSuchElementException::new);

        if (req.getEstado() != Estado.PENDIENTE)
            throw new IllegalStateException("estado-no-pendiente");

        if (req.getTipo() == TipoCompra.EXTRAORDINARIA && req.getCotizacionPath() == null)
            throw new IllegalStateException("cotizacion-requerida");

        req.setEstado(Estado.PRE_AUTORIZADA);
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
}
