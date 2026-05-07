package com.marakame.api.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.SeguimientoTablaDTO;
import com.marakame.api.entity.Paciente;
import com.marakame.api.entity.Prioridad;
import com.marakame.api.entity.Seguimiento;
import com.marakame.api.repository.PacienteRepository;
import com.marakame.api.repository.SeguimientoRepository;

@RestController
@RequestMapping("/api/seguimientos")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class SeguimientoController {

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @GetMapping("/tablas")
    public SeguimientoTablasResponse obtenerTablasAdmisiones() {
        List<SeguimientoTablaDTO> seguimiento = seguimientoRepository.findAll()
            .stream()
            .map(this::toTablaDTO)
            .toList();

        List<SeguimientoTablaDTO> citas = seguimiento.stream()
            .filter(item -> !esLlamada(item.tipoAccion()))
            .toList();

        List<SeguimientoTablaDTO> llamadas = seguimiento.stream()
            .filter(item -> esLlamada(item.tipoAccion()))
            .toList();

        return new SeguimientoTablasResponse(citas, llamadas);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> actualizarEstadoSeguimiento(
        @PathVariable Long id,
        @RequestBody ActualizarEstadoRequest request
    ) {
        if (request == null || request.estadoSeguimiento() == null || request.estadoSeguimiento().isBlank()) {
            return new ResponseEntity<>(Map.of(
                "error", "El estadoSeguimiento es obligatorio."
            ), HttpStatus.BAD_REQUEST);
        }

        Seguimiento seguimiento = seguimientoRepository.findById(id)
            .orElse(null);

        if (seguimiento == null) {
            return new ResponseEntity<>(Map.of(
                "error", "No existe el seguimiento indicado."
            ), HttpStatus.NOT_FOUND);
        }

        seguimiento.setEstadoSeguimiento(request.estadoSeguimiento().trim());
        seguimientoRepository.save(seguimiento);

        return ResponseEntity.ok(Map.of(
            "id", seguimiento.getId(),
            "estadoSeguimiento", seguimiento.getEstadoSeguimiento()
        ));
    }

    @PostMapping("/citas")
    public ResponseEntity<Map<String, Object>> crearCita(@RequestBody CrearCitaRequest request) {
        if (request == null || request.pacienteId() == null || request.fechaHoraProgramada() == null || request.tipoCita() == null || request.tipoCita().isBlank()) {
            return new ResponseEntity<>(Map.of(
                "error", "pacienteId, fechaHoraProgramada y tipoCita son obligatorios."
            ), HttpStatus.BAD_REQUEST);
        }

        Paciente paciente = pacienteRepository.findById(request.pacienteId()).orElse(null);
        if (paciente == null) {
            return new ResponseEntity<>(Map.of(
                "error", "No existe el paciente indicado."
            ), HttpStatus.NOT_FOUND);
        }

        boolean tieneLlamadaInicial = seguimientoRepository.existsByPaciente_IdAndTipoAccionContainingIgnoreCase(request.pacienteId(), "llamada");
        boolean tieneHistorialSeguimiento = seguimientoRepository.existsByPaciente_Id(request.pacienteId());
        if (!tieneLlamadaInicial && !tieneHistorialSeguimiento) {
            return new ResponseEntity<>(Map.of(
                "error", "El paciente no tiene historial de seguimiento o llamada inicial registrada."
            ), HttpStatus.CONFLICT);
        }

        Seguimiento cita = new Seguimiento();
        cita.setPaciente(paciente);
        cita.setTipoAccion(request.tipoCita().trim());
        cita.setEstadoSeguimiento("Pendiente");
        cita.setEstadoAsistencia("Pendiente");
        cita.setDiagnosticoVisual("");
        cita.setFechaHoraProgramada(request.fechaHoraProgramada());
        cita.setMotivo(request.motivo() == null ? "" : request.motivo().trim());
        cita.setOrigenLlamada(null);
        cita.setPrioridad(Prioridad.MEDIA);
        cita.setResponsable("Admisiones");
        cita.setFechaSiguienteAccion(request.fechaHoraProgramada());

        Seguimiento guardado = seguimientoRepository.save(cita);
        return new ResponseEntity<>(Map.of(
            "id", guardado.getId(),
            "pacienteId", paciente.getId(),
            "estadoSeguimiento", guardado.getEstadoSeguimiento()
        ), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/asistencia")
    public ResponseEntity<Map<String, Object>> actualizarAsistenciaCita(
        @PathVariable Long id,
        @RequestBody ActualizarAsistenciaRequest request
    ) {
        if (request == null || request.estadoAsistencia() == null || request.estadoAsistencia().isBlank()) {
            return new ResponseEntity<>(Map.of(
                "error", "estadoAsistencia es obligatorio."
            ), HttpStatus.BAD_REQUEST);
        }

        Seguimiento seguimiento = seguimientoRepository.findById(id).orElse(null);
        if (seguimiento == null) {
            return new ResponseEntity<>(Map.of(
                "error", "No existe el seguimiento indicado."
            ), HttpStatus.NOT_FOUND);
        }

        String estadoAsistencia = request.estadoAsistencia().trim();
        if (!estadoAsistencia.equalsIgnoreCase("Llegó") && !estadoAsistencia.equalsIgnoreCase("No se presentó") && !estadoAsistencia.equalsIgnoreCase("Pendiente")) {
            return new ResponseEntity<>(Map.of(
                "error", "estadoAsistencia no válido. Usa Llegó, No se presentó o Pendiente."
            ), HttpStatus.BAD_REQUEST);
        }

        boolean esNoPresento = estadoAsistencia.equalsIgnoreCase("No se presentó");

        if (estadoAsistencia.equalsIgnoreCase("Llegó") && (request.diagnosticoVisual() == null || request.diagnosticoVisual().isBlank())) {
            return new ResponseEntity<>(Map.of(
                "error", "diagnosticoVisual es obligatorio cuando el estado es Llegó."
            ), HttpStatus.BAD_REQUEST);
        }

        seguimiento.setEstadoAsistencia(estadoAsistencia);
        seguimiento.setEstadoSeguimiento(esNoPresento ? "No se presentó - requiere re agendación" : estadoAsistencia);
        seguimiento.setDiagnosticoVisual(request.diagnosticoVisual() == null ? "" : request.diagnosticoVisual().trim());

        if (esNoPresento) {
            seguimiento.setPrioridad(Prioridad.ALTA);
            seguimiento.setFechaSiguienteAccion(LocalDateTime.now().plusDays(1));
        }

        seguimientoRepository.save(seguimiento);

        Map<String, Object> responseBody = new LinkedHashMap<>();
        responseBody.put("id", seguimiento.getId());
        responseBody.put("estadoAsistencia", seguimiento.getEstadoAsistencia());
        responseBody.put("estadoSeguimiento", seguimiento.getEstadoSeguimiento());
        responseBody.put("diagnosticoVisual", seguimiento.getDiagnosticoVisual());
        responseBody.put("prioridad", seguimiento.getPrioridad());
        responseBody.put("fechaSiguienteAccion", seguimiento.getFechaSiguienteAccion());
        responseBody.put("avisoReagendacion", esNoPresento);

        return ResponseEntity.ok(responseBody);
    }

    private SeguimientoTablaDTO toTablaDTO(Seguimiento seguimiento) {
        Long pacienteId = seguimiento.getPaciente() != null ? seguimiento.getPaciente().getId() : null;
        String nombre = seguimiento.getPaciente() != null ? seguimiento.getPaciente().getNombreCompleto() : "Sin nombre";
        String telefono = seguimiento.getPaciente() != null ? seguimiento.getPaciente().getTelefonoContacto() : "";

        return new SeguimientoTablaDTO(
            seguimiento.getId(),
            pacienteId,
            seguimiento.getTipoAccion(),
            seguimiento.getEstadoSeguimiento(),
            seguimiento.getOrigenLlamada(),
            seguimiento.getEstadoAsistencia(),
            seguimiento.getDiagnosticoVisual(),
            seguimiento.getFechaHoraProgramada(),
            seguimiento.getMotivo(),
            nombre,
            telefono,
            seguimiento.getPrioridad(),
            seguimiento.getResponsable(),
            seguimiento.getFechaSiguienteAccion()
        );
    }

    private boolean esLlamada(String tipoAccion) {
        return tipoAccion != null && tipoAccion.toLowerCase(Locale.ROOT).contains("llamada");
    }

    public record SeguimientoTablasResponse(
        List<SeguimientoTablaDTO> citas,
        List<SeguimientoTablaDTO> llamadas
    ) {}

    public record ActualizarEstadoRequest(
        String estadoSeguimiento
    ) {}

    public record CrearCitaRequest(
        Long pacienteId,
        LocalDateTime fechaHoraProgramada,
        String tipoCita,
        String motivo
    ) {}

    public record ActualizarAsistenciaRequest(
        String estadoAsistencia,
        String diagnosticoVisual
    ) {}
}