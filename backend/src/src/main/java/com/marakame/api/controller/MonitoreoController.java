package com.marakame.api.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.entity.PlanMonitoreo;
import com.marakame.api.entity.RegistroMonitoreo;
import com.marakame.api.repository.PlanMonitoreoRepository;
import com.marakame.api.repository.RegistroMonitoreoRepository;
import com.marakame.api.service.PdfService;

@RestController
@RequestMapping("/api/monitoreo")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class MonitoreoController {

    @Autowired
    private PlanMonitoreoRepository planRepository;

    @Autowired
    private RegistroMonitoreoRepository registroRepository;

    @Autowired
    private PdfService pdfService;

    // --- CLASES AUXILIARES PARA LEER EL JSON DE REACT ---
    public static class PlanRequest {
        public Long pacienteId;
        public String tipo, fechaInicio, fechaFin, hora, dias;
        public Boolean ayuno;
    }

    public static class RegistroRequest {
        public Long planId;
        public String fecha, hora, resultado, firma;
    }

    // --- 1. GUARDAR EL PLAN ---
    @PostMapping("/plan")
    public ResponseEntity<?> guardarPlan(@RequestBody PlanRequest req) {
        try {
            // Si ya hay un plan activo de este tipo, lo cerramos (lo ponemos en false)
            Optional<PlanMonitoreo> planAnterior = planRepository.findByPacienteIdAndTipoAndActivoTrue(req.pacienteId, req.tipo);
            if (planAnterior.isPresent()) {
                PlanMonitoreo viejo = planAnterior.get();
                viejo.setActivo(false);
                planRepository.save(viejo);
            }

            // Creamos el nuevo plan
            PlanMonitoreo nuevo = new PlanMonitoreo();
            nuevo.setPacienteId(req.pacienteId);
            nuevo.setTipo(req.tipo);
            nuevo.setFechaInicio(LocalDate.parse(req.fechaInicio));
            if (req.fechaFin != null && !req.fechaFin.isEmpty()) nuevo.setFechaFin(LocalDate.parse(req.fechaFin));
            nuevo.setHora(LocalTime.parse(req.hora));
            nuevo.setDias(req.dias);
            nuevo.setAyuno(req.ayuno);
            nuevo.setActivo(true); // Se marca como vigente

            return ResponseEntity.ok(planRepository.save(nuevo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar plan: " + e.getMessage());
        }
    }

    // --- 2. GUARDAR UN REGISTRO (TOMA DIARIA) ---
    @PostMapping("/registro")
    public ResponseEntity<?> guardarRegistro(@RequestBody RegistroRequest req) {
        try {
            PlanMonitoreo plan = planRepository.findById(req.planId)
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

            RegistroMonitoreo reg = new RegistroMonitoreo();
            reg.setPlan(plan);
            reg.setFechaToma(LocalDate.parse(req.fecha));
            reg.setHoraToma(LocalTime.parse(req.hora));
            reg.setResultado(req.resultado);
            reg.setFirma(req.firma);

            return ResponseEntity.ok(registroRepository.save(reg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar registro: " + e.getMessage());
        }
    }

    // --- 3. DESCARGAR PDF (Lo que ya habíamos hecho) ---
    @GetMapping("/{pacienteId}/pdf/{tipo}")
    public ResponseEntity<byte[]> descargarFormatoPdf(@PathVariable Long pacienteId, @PathVariable String tipo) {
        try {
            byte[] pdfBytes = pdfService.generarFormatoMonitoreo(pacienteId, tipo);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Control_" + tipo + ".pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{pacienteId}")
    public ResponseEntity<?> obtenerMonitoreoPaciente(@PathVariable Long pacienteId) {
        try {
            // Usamos un mapa para enviar todo empaquetado en una sola respuesta a React
            java.util.Map<String, Object> respuesta = new java.util.HashMap<>();
            
            // Buscar plan de Glucosa y sus registros
            Optional<PlanMonitoreo> planGlucosa = planRepository.findByPacienteIdAndTipoAndActivoTrue(pacienteId, "GLUCOSA");
            if (planGlucosa.isPresent()) {
                respuesta.put("planGlucosa", planGlucosa.get());
                respuesta.put("registrosGlucosa", registroRepository.findByPlan_IdOrderByFechaTomaDescHoraTomaDesc(planGlucosa.get().getId()));
            }

            // Buscar plan de Tensión Arterial y sus registros
            Optional<PlanMonitoreo> planTA = planRepository.findByPacienteIdAndTipoAndActivoTrue(pacienteId, "TA");
            if (planTA.isPresent()) {
                respuesta.put("planTA", planTA.get());
                respuesta.put("registrosTA", registroRepository.findByPlan_IdOrderByFechaTomaDescHoraTomaDesc(planTA.get().getId()));
            }

            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cargar datos: " + e.getMessage());
        }
    }
}