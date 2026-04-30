package com.marakame.api.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.dto.NotaEvolucionDTO;
import com.marakame.api.entity.EstudioSocioeconomicoPdf;
import com.marakame.api.entity.Paciente;
import com.marakame.api.service.PacienteService;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class PacienteController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PacienteController.class);

    @Autowired
    private PacienteService pacienteService;

    @GetMapping("/estudio")
    public List<Paciente> obtenerPacientesParaEstudio(@RequestParam(required = false) String query) {
        return pacienteService.obtenerPacientesParaEstudio(query);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Paciente>> obtenerPacientesActivos() {
        return ResponseEntity.ok(pacienteService.obtenerPacientesActivos());
    }

    @GetMapping("/{id}/expediente")
    public ResponseEntity<Map<String, Object>> obtenerDetalleExpediente(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pacienteService.obtenerDetalleExpediente(id));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            LOGGER.error("Error al cargar detalle de expediente para paciente {}", id, e);
            return new ResponseEntity<>(Map.of(
                "error", "No se pudo cargar el detalle del expediente.",
                "detalle", e.getClass().getSimpleName() + ": " + String.valueOf(e.getMessage())
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{pacienteId}/estudio-socioeconomico/pdf/{pdfId}/descargar")
    public ResponseEntity<?> descargarPdfSocioeconomico(
        @PathVariable Long pacienteId,
        @PathVariable Long pdfId
    ) {
        return responderPdfSocioeconomico(pacienteId, pdfId, false);
    }

    @GetMapping("/{pacienteId}/estudio-socioeconomico/pdf/{pdfId}/ver")
    public ResponseEntity<?> verPdfSocioeconomico(
        @PathVariable Long pacienteId,
        @PathVariable Long pdfId
    ) {
        return responderPdfSocioeconomico(pacienteId, pdfId, true);
    }

    @GetMapping("/{pacienteId}/estudio-socioeconomico/pdf/{pdfId}/imprimir")
    public ResponseEntity<?> imprimirPdfSocioeconomico(
        @PathVariable Long pacienteId,
        @PathVariable Long pdfId
    ) {
        return responderPdfSocioeconomico(pacienteId, pdfId, true);
    }

    @PostMapping("/guardar-expediente")
    public ResponseEntity<String> guardarExpediente(@RequestBody PacienteDTO dto) {
        try {
            pacienteService.guardarNuevoExpediente(dto);
            return new ResponseEntity<>("Expediente y seguimiento creados con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar el expediente: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/notas-evolucion")
        public ResponseEntity<?> agregarNotaEvolucion(
            @PathVariable Long id, 
            @RequestBody NotaEvolucionDTO notaDTO) {
        try {
            pacienteService.agregarNotaEvolucion(id, notaDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensaje", "Nota clínica guardada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/llamada-inicial")
    public ResponseEntity<String> actualizarLlamadaInicial(
        @PathVariable Long id,
        @RequestBody PacienteDTO dto
    ) {
        try {
            pacienteService.actualizarLlamadaInicial(id, dto);
            return new ResponseEntity<>("Llamada inicial actualizada con exito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar la llamada inicial: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/estudio-basico")
    public ResponseEntity<String> actualizarEstudioBasico(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload
    ) {
        try {
            pacienteService.actualizarDatosBasicosEstudio(id, payload);
            return new ResponseEntity<>("Datos basicos actualizados con exito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar estudio basico: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/estudio-socioeconomico/pdf")
    public ResponseEntity<Map<String, Object>> generarPdfSocioeconomico(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload
    ) {
        try {
            var pdf = pacienteService.generarYGuardarPdfEstudio(id, payload);
            return ResponseEntity.ok(Map.of(
                "pdfId", pdf.getId(),
                "pacienteId", id,
                "nombreArchivo", pdf.getNombreArchivo()
            ));
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                "error", "Error al generar el PDF: " + e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<?> responderPdfSocioeconomico(Long pacienteId, Long pdfId, boolean inline) {
        try {
            var pdf = pacienteService.obtenerPdfSocioeconomico(pacienteId, pdfId);
            if (pdf.isEmpty()) {
                return new ResponseEntity<>(Map.of(
                    "error", "No se encontró el PDF solicitado para este paciente."
                ), HttpStatus.NOT_FOUND);
            }

            return buildPdfResponse(pdf.get(), inline);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                "error", "No se pudo cargar el PDF.",
                "detalle", e.getClass().getSimpleName() + ": " + String.valueOf(e.getMessage())
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<byte[]> buildPdfResponse(EstudioSocioeconomicoPdf pdf, boolean inline) {
        String nombreArchivo = pdf.getNombreArchivo() == null || pdf.getNombreArchivo().isBlank()
            ? "estudio_socioeconomico.pdf"
            : pdf.getNombreArchivo();

        String disposition = inline ? "inline" : "attachment";

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + nombreArchivo + "\"")
            .body(pdf.getContenidoPdf());
    }
}