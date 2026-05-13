package com.marakame.api.controller;

import com.marakame.api.entity.DocumentoClinico;
import com.marakame.api.repository.DocumentoClinicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documentos/clinico")
@CrossOrigin(origins = "*")
public class DocumentoClinicoController {

    @Autowired
    private DocumentoClinicoRepository documentoRepository;

    private final String UPLOAD_DIR = "uploads/expedientes/";

    @PostMapping("/upload")
    public ResponseEntity<?> subirDocumento(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("pacienteId") Long pacienteId,
            @RequestParam("nombrePaso") String nombrePaso,
            @RequestParam("departamento") String departamento) { // <-- RECIBIMOS DEPARTAMENTO
        
        if (archivo.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Archivo vacío");

        try {
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) directory.mkdirs();

            String nombreArchivoFinal = pacienteId + "_" + departamento + "_" + nombrePaso.replaceAll(" ", "_") + "_" + archivo.getOriginalFilename();
            Path rutaFisica = Paths.get(UPLOAD_DIR + nombreArchivoFinal);
            Files.write(rutaFisica, archivo.getBytes());

            DocumentoClinico doc = new DocumentoClinico();
            doc.setPacienteId(pacienteId);
            doc.setDepartamento(departamento); // <-- GUARDAMOS EL DATO
            doc.setNombrePaso(nombrePaso);
            doc.setNombreArchivo(nombreArchivoFinal);
            doc.setRutaArchivo(rutaFisica.toString());
            
            documentoRepository.save(doc);
            return ResponseEntity.ok(doc);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar");
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<DocumentoClinico>> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(documentoRepository.findByPacienteId(pacienteId));
    }
}