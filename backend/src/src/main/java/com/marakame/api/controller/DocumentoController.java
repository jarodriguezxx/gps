package com.marakame.api.controller;

import com.marakame.api.entity.DocumentoClinico;
import com.marakame.api.repository.DocumentoClinicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoClinicoRepository repository;

    @Value("${app.expedientes.dir}")
    private String expedientesDir;

    @GetMapping("/paciente/{pacienteId}")
    public List<DocumentoClinico> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return repository.findByPacienteIdOrderByFechaSubidaDesc(pacienteId);
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> subirDocumento(
            @RequestParam MultipartFile archivo,
            @RequestParam Long pacienteId,
            @RequestParam String nombrePaso,
            @RequestParam String departamento) {
        try {
            Path dir = Paths.get(expedientesDir);
            Files.createDirectories(dir);

            String extension = "";
            String originalName = archivo.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String nombreGuardado = UUID.randomUUID() + extension;
            Path destino = dir.resolve(nombreGuardado);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Elimina documento previo del mismo paso/departamento/paciente si existe
            repository.findByPacienteIdOrderByFechaSubidaDesc(pacienteId).stream()
                .filter(d -> nombrePaso.equals(d.getNombrePaso()) && departamento.equals(d.getDepartamento()))
                .forEach(d -> {
                    try { Files.deleteIfExists(Paths.get(expedientesDir, d.getNombreArchivo())); } catch (IOException ignored) {}
                    repository.delete(d);
                });

            DocumentoClinico doc = new DocumentoClinico();
            doc.setPacienteId(pacienteId);
            doc.setNombrePaso(nombrePaso);
            doc.setDepartamento(departamento);
            doc.setNombreArchivo(nombreGuardado);
            doc.setRutaArchivo("uploads/expedientes/" + nombreGuardado);
            doc.setTipoArchivo(archivo.getContentType());

            return ResponseEntity.ok(repository.save(doc));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al guardar documento: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return repository.findById(id).map(doc -> {
            try {
                Files.deleteIfExists(Paths.get(expedientesDir, doc.getNombreArchivo()));
            } catch (IOException ignored) {}
            repository.delete(doc);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
