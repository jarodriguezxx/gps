package com.marakame.api.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.NotaEvolucionDTO;
import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.EstudioSocioeconomicoPdf;
import com.marakame.api.entity.Paciente;
import com.marakame.api.service.PacienteService;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:5173") 
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // ==========================================
    // 1. GESTIÓN DE EXPEDIENTES Y NOTAS MÉDICAS
    // ==========================================

    @GetMapping("/{id}/expediente")
    public ResponseEntity<?> obtenerDetalleExpediente(@PathVariable Long id) {
        try {
            // Carga el expediente con sus notas y PDFs (Si no existe, lo crea automáticamente)
            Map<String, Object> detalle = pacienteService.obtenerDetalleExpediente(id);
            return ResponseEntity.ok(detalle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/recibos")
    public ResponseEntity<?> obtenerRecibosPorPaciente(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pacienteService.obtenerRecibosPorPaciente(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al obtener recibos: " + e.getMessage()));
        }
    }

    @GetMapping("/validacion-pagos")
    public ResponseEntity<?> obtenerPacientesPendientesValidacionPago() {
        try {
            return ResponseEntity.ok(pacienteService.obtenerPacientesPendientesValidacionPago());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al obtener validaciones pendientes: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/recibos")
    public ResponseEntity<?> registrarReciboPendiente(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(pacienteService.registrarReciboPendiente(id, payload));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al registrar recibo: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/recibos/{reciboId}")
    public ResponseEntity<?> eliminarReciboPorPaciente(@PathVariable Long id, @PathVariable Long reciboId) {
        try {
            pacienteService.eliminarReciboDePaciente(id, reciboId);
            return ResponseEntity.ok(Map.of("success", true, "mensaje", "Recibo eliminado correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al eliminar recibo: " + e.getMessage()));
        }
    }

    @GetMapping("/dashboard/metricas")
    public ResponseEntity<?> obtenerMetricasJefatura() {
        try {
            return ResponseEntity.ok(pacienteService.obtenerMetricasDashboard());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Error al calcular métricas: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/notas-evolucion")
    public ResponseEntity<?> agregarNotaEvolucion(@PathVariable Long id, @RequestBody NotaEvolucionDTO notaDTO) {
        try {
            pacienteService.agregarNotaEvolucion(id, notaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", "Nota médica guardada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Error al guardar la nota: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/rechazo-administrativo")
    public ResponseEntity<?> registrarRechazoAdministrativo(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String estado = payload.get("estado");
            String observaciones = payload.get("observaciones");
            Map<String, Object> resultado = pacienteService.registrarRechazoAdministrativo(id, estado, observaciones);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al registrar el rechazo: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/iniciar-pago")
    public ResponseEntity<?> iniciarPago(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String folioRecibo = payload.get("folioRecibo");
            if (folioRecibo == null || folioRecibo.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "folioRecibo es requerido"));
            }
            Paciente paciente = pacienteService.iniciarPagoPaciente(id, folioRecibo);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "Pago iniciado correctamente",
                "pacienteId", paciente.getId(),
                "folioRecibo", paciente.getFolioRecibo(),
                "pagoValidado", paciente.getPagoValidado(),
                "fechaRegistroRecibo", paciente.getFechaRegistroRecibo()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al iniciar pago: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/validar-pago")
    public ResponseEntity<?> validarPago(@PathVariable Long id) {
        try {
            Paciente paciente = pacienteService.validarPagoPaciente(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "Pago validado correctamente",
                "pacienteId", paciente.getId(),
                "folioRecibo", paciente.getFolioRecibo(),
                "fechaValidacion", paciente.getFechaValidacion()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al validar pago: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> guardarNuevoExpediente(@RequestBody PacienteDTO dto) {
        try {
            pacienteService.guardarNuevoExpediente(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", "Expediente y paciente creados correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // ==========================================
    // 2. BÚSQUEDAS Y LISTADOS DE PACIENTES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Paciente>> obtenerTodosPacientes() {
        return ResponseEntity.ok(pacienteService.obtenerTodosPacientes());
    }


    @GetMapping("/busqueda")
    public ResponseEntity<List<Paciente>> buscarPacientesParaEstudio(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(pacienteService.obtenerPacientesParaEstudio(query));
    }

    // ==========================================
    // 3. ACTUALIZACIÓN DE DATOS (TRABAJO SOCIAL / LLAMADAS)
    // ==========================================

    @PutMapping("/{id}/llamada-inicial")
    public ResponseEntity<?> actualizarLlamadaInicial(@PathVariable Long id, @RequestBody PacienteDTO dto) {
        try {
            pacienteService.actualizarLlamadaInicial(id, dto);
            return ResponseEntity.ok(Map.of("mensaje", "Llamada inicial actualizada correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/datos-basicos")
    public ResponseEntity<?> actualizarDatosBasicosEstudio(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            pacienteService.actualizarDatosBasicosEstudio(id, payload);
            return ResponseEntity.ok(Map.of("mensaje", "Datos básicos actualizados correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // ==========================================
    // 4. GENERACIÓN Y DESCARGA DE PDFs
    // ==========================================

    @GetMapping("/{id}/estudio-socioeconomico/pdf")
    public ResponseEntity<?> listarPdfsEstudio(@PathVariable Long id) {
        try {
            Map<String, Object> detalle = pacienteService.obtenerDetalleExpediente(id);
            Object documentos = detalle.get("documentos");
            return ResponseEntity.ok(documentos == null ? List.of() : documentos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al listar PDFs: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/estudio-socioeconomico/pdf")
    public ResponseEntity<?> generarPdfEstudio(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            EstudioSocioeconomicoPdf pdf = pacienteService.generarYGuardarPdfEstudio(id, payload);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "mensaje", "PDF generado exitosamente",
                "pdfId", pdf.getId(),
                "nombreArchivo", pdf.getNombreArchivo()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al generar PDF: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/estudio-socioeconomico/pdf/{pdfId}/descargar")
    public ResponseEntity<?> descargarPdfSocioeconomico(@PathVariable Long id, @PathVariable Long pdfId) {
        Optional<EstudioSocioeconomicoPdf> pdfOptional = pacienteService.obtenerPdfSocioeconomico(id, pdfId);

        if (pdfOptional.isPresent()) {
            EstudioSocioeconomicoPdf pdf = pdfOptional.get();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + pdf.getNombreArchivo() + "\"")
                    .body(pdf.getContenidoPdf());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "PDF no encontrado o no pertenece a este paciente"));
    }

    // ========== NUEVOS ENDPOINTS PARA GESTIÓN DE ESTADO Y PAGOS ==========

    @GetMapping("/{id}")
public ResponseEntity<?> buscarPacientePorIdEspecifico(@PathVariable Long id) {
            try {
            var paciente = pacienteService.obtenerPacientePorId(id);
            if (paciente.isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "Paciente no encontrado"), HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(paciente.get());
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/validar-ingreso")
    public ResponseEntity<?> validarIngresoYGenerarClave(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload
    ) {
        try {
            String clavePaciente = pacienteService.validarIngresoYGenerarClave(id, payload);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "clavePaciente", clavePaciente,
                "estadoPaciente", "INGRESADO",
                "mensaje", "Paciente validado e ingresado exitosamente"
            ));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of(
                "error", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                "error", "Error al validar ingreso: " + e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstadoPaciente(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload
    ) {
        try {
            String nuevoEstado = payload.get("estado");
            if (nuevoEstado == null || nuevoEstado.isBlank()) {
                return new ResponseEntity<>(Map.of("error", "Estado no puede estar vacío"), HttpStatus.BAD_REQUEST);
            }
            var paciente = pacienteService.cambiarEstadoPaciente(id, nuevoEstado);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "estadoPaciente", paciente.getEstadoPaciente(),
                "mensaje", "Estado actualizado exitosamente"
            ));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}