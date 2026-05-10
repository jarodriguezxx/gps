package com.marakame.api.controller;

import com.marakame.api.entity.NotaEvolucion;
import com.marakame.api.entity.ExpedienteClinico;
import com.marakame.api.repository.NotaEvolucionRepository;
import com.marakame.api.repository.ExpedienteClinicoRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notas-evolucion")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")public class NotaEvolucionController {

    @Autowired
    private NotaEvolucionRepository notaRepository;

    @Autowired
    private ExpedienteClinicoRepository expedienteRepository;

    // Clase auxiliar para recibir exactamente lo que manda React
// Clase auxiliar blindada con Getters y Setters
    public static class NotaRequest {
        private Long pacienteId;
        private String medicoAsignado, ta, temp, fc, fr, peso, talla;
        private String evolucionCuadroClinico, exploracionFisica, resultadosEstudios;
        private String diagnosticoProblemas, pronosticos, tratamientoIndicaciones, observaciones;

        // Getters
        public Long getPacienteId() { return pacienteId; }
        public String getMedicoAsignado() { return medicoAsignado; }
        public String getTa() { return ta; }
        public String getTemp() { return temp; }
        public String getFc() { return fc; }
        public String getFr() { return fr; }
        public String getPeso() { return peso; }
        public String getTalla() { return talla; }
        public String getEvolucionCuadroClinico() { return evolucionCuadroClinico; }
        public String getExploracionFisica() { return exploracionFisica; }
        public String getResultadosEstudios() { return resultadosEstudios; }
        public String getDiagnosticoProblemas() { return diagnosticoProblemas; }
        public String getPronosticos() { return pronosticos; }
        public String getTratamientoIndicaciones() { return tratamientoIndicaciones; }
        public String getObservaciones() { return observaciones; }

        // Setters
        public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
        public void setMedicoAsignado(String medicoAsignado) { this.medicoAsignado = medicoAsignado; }
        public void setTa(String ta) { this.ta = ta; }
        public void setTemp(String temp) { this.temp = temp; }
        public void setFc(String fc) { this.fc = fc; }
        public void setFr(String fr) { this.fr = fr; }
        public void setPeso(String peso) { this.peso = peso; }
        public void setTalla(String talla) { this.talla = talla; }
        public void setEvolucionCuadroClinico(String evolucionCuadroClinico) { this.evolucionCuadroClinico = evolucionCuadroClinico; }
        public void setExploracionFisica(String exploracionFisica) { this.exploracionFisica = exploracionFisica; }
        public void setResultadosEstudios(String resultadosEstudios) { this.resultadosEstudios = resultadosEstudios; }
        public void setDiagnosticoProblemas(String diagnosticoProblemas) { this.diagnosticoProblemas = diagnosticoProblemas; }
        public void setPronosticos(String pronosticos) { this.pronosticos = pronosticos; }
        public void setTratamientoIndicaciones(String tratamientoIndicaciones) { this.tratamientoIndicaciones = tratamientoIndicaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    }

    @PostMapping
    public ResponseEntity<?> crearNota(@RequestBody NotaRequest request) {
        try {
            // 1. Buscamos el Expediente Clínico del paciente
            // (Si tu método para buscar el expediente se llama distinto, cámbialo aquí)
            ExpedienteClinico expediente = expedienteRepository.findByPaciente_Id(request.pacienteId)
                    .orElseThrow(() -> new RuntimeException("Expediente no encontrado para este paciente"));

            // 2. Creamos la nota y mapeamos cada campo exacto de tu entidad
            NotaEvolucion nota = new NotaEvolucion();
            nota.setExpediente(expediente);
            nota.setMedicoAsignado(request.medicoAsignado);
            nota.setFechaRegistro(LocalDateTime.now());
            
            // Signos vitales
            nota.setTa(request.ta);
            nota.setTemp(request.temp);
            nota.setFc(request.fc);
            nota.setFr(request.fr);
            nota.setPeso(request.peso);
            nota.setTalla(request.talla);

            // Secciones clínicas
            nota.setEvolucionCuadroClinico(request.evolucionCuadroClinico);
            nota.setExploracionFisica(request.exploracionFisica);
            nota.setResultadosEstudios(request.resultadosEstudios);
            nota.setDiagnosticoProblemas(request.diagnosticoProblemas);
            nota.setPronosticos(request.pronosticos);
            nota.setTratamientoIndicaciones(request.tratamientoIndicaciones);
            nota.setObservaciones(request.observaciones);

            NotaEvolucion guardada = notaRepository.save(nota);
            return ResponseEntity.ok(guardada);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar: " + e.getMessage());
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<NotaEvolucion>> obtenerPorPaciente(@PathVariable Long pacienteId) {
        // Usamos el método que me mostraste en tu repositorio
        return ResponseEntity.ok(notaRepository.findByExpediente_Paciente_IdOrderByFechaRegistroDesc(pacienteId));
    }
}
