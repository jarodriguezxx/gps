package com.marakame.api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marakame.api.entity.ArchivoExpediente;
import com.marakame.api.entity.ExpedienteMedico;
import com.marakame.api.entity.HistoriaMedica;
import com.marakame.api.entity.Paciente;
import com.marakame.api.repository.ArchivoRepository;
import com.marakame.api.repository.ExpedienteRepository;
import com.marakame.api.repository.HistoriaMedicaRepository;
import com.marakame.api.repository.PacienteRepository;

@Service
public class ExpedienteService {

    @Autowired
    private ExpedienteRepository expedienteRepository;

    @Autowired
    private ArchivoRepository archivoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private HistoriaMedicaRepository historiaMedicaRepository;

    @Transactional
    public ExpedienteMedico crearExpediente(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        // Verificar si ya existe expediente
        if (expedienteRepository.findByPacienteId(pacienteId).isPresent()) {
            throw new IllegalArgumentException("El paciente ya tiene expediente");
        }

        ExpedienteMedico expediente = new ExpedienteMedico();
        expediente.setPaciente(paciente);
        expediente.setFechaCreacion(LocalDateTime.now());
        expediente.setFechaUltimaActualizacion(LocalDateTime.now());
        expediente.setEstado("ACTIVO");

        return expedienteRepository.save(expediente);
    }

    @Transactional
    public ExpedienteMedico vincularHistoriaMedica(Long expedienteId, Long historiaMedicaId) {
        ExpedienteMedico expediente = expedienteRepository.findById(expedienteId)
                .orElseThrow(() -> new IllegalArgumentException("Expediente no encontrado"));

        HistoriaMedica historia = historiaMedicaRepository.findById(historiaMedicaId)
                .orElseThrow(() -> new IllegalArgumentException("Historia médica no encontrada"));

        expediente.setHistoriaMedica(historia);
        expediente.setFechaUltimaActualizacion(LocalDateTime.now());

        return expedienteRepository.save(expediente);
    }

    public ExpedienteMedico obtenerExpedientePorPaciente(Long pacienteId) {
        return expedienteRepository.findByPacienteId(pacienteId)
                .orElseThrow(() -> new IllegalArgumentException("Expediente no encontrado para este paciente"));
    }

    public ExpedienteMedico obtenerExpediente(Long expedienteId) {
        return expedienteRepository.findById(expedienteId)
                .orElseThrow(() -> new IllegalArgumentException("Expediente no encontrado"));
    }

    @Transactional
    public ArchivoExpediente agregarArchivo(Long expedienteId, String nombreArchivo, String rutaArchivo,
                                            String tipoArchivo, String tipoDocumento, String subidoPor) {
        ExpedienteMedico expediente = expedienteRepository.findById(expedienteId)
                .orElseThrow(() -> new IllegalArgumentException("Expediente no encontrado"));

        ArchivoExpediente archivo = new ArchivoExpediente();
        archivo.setExpediente(expediente);
        archivo.setNombreArchivo(nombreArchivo);
        archivo.setRutaArchivo(rutaArchivo);
        archivo.setTipoArchivo(tipoArchivo);
        archivo.setTipoDocumento(tipoDocumento);
        archivo.setFechaSubida(LocalDateTime.now());
        archivo.setSubidoPor(subidoPor);

        expediente.setFechaUltimaActualizacion(LocalDateTime.now());
        expedienteRepository.save(expediente);

        return archivoRepository.save(archivo);
    }

    public List<ArchivoExpediente> obtenerArchivosExpediente(Long expedienteId) {
        return archivoRepository.findByExpedienteId(expedienteId);
    }
}
