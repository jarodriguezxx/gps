package com.marakame.api.service;

import com.marakame.api.entity.Paciente;
import com.marakame.api.entity.SeguimientoValoracion;
import com.marakame.api.entity.ValoracionMedica;
import com.marakame.api.repository.PacienteRepository;
import com.marakame.api.repository.SeguimientoValoracionRepository;
import com.marakame.api.repository.ValoracionMedicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ValoracionMedicaService {

    @Autowired
    private ValoracionMedicaRepository valoracionRepository;

    @Autowired
    private SeguimientoValoracionRepository seguimientoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // 1. OBTENER LA VALORACIÓN DE UN PROSPECTO
    public Optional<ValoracionMedica> obtenerValoracionPorPaciente(Long pacienteId) {
        return valoracionRepository.findByPacienteId(pacienteId);
    }

    // 2. CREAR LA VALORACIÓN INICIAL
    @Transactional
    public ValoracionMedica crearValoracion(Long pacienteId, ValoracionMedica datosValoracion) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new IllegalArgumentException("Prospecto/Paciente no encontrado con ID: " + pacienteId));

        // Verificamos que no tenga una valoración previa para no duplicar
        if (valoracionRepository.findByPacienteId(pacienteId).isPresent()) {
            throw new IllegalArgumentException("Este prospecto ya cuenta con una valoración médica inicial.");
        }

        datosValoracion.setPaciente(paciente);
        datosValoracion.setFechaHora(LocalDateTime.now());
        
        return valoracionRepository.save(datosValoracion);
    }

    // 3. AGREGAR UN SEGUIMIENTO POSTERIOR
    @Transactional
    public SeguimientoValoracion agregarSeguimiento(Long valoracionId, SeguimientoValoracion nuevoSeguimiento) {
        ValoracionMedica valoracion = valoracionRepository.findById(valoracionId)
                .orElseThrow(() -> new IllegalArgumentException("Valoración médica no encontrada."));

        nuevoSeguimiento.setValoracion(valoracion);
        
        // Si quieres, aquí puedes actualizar automáticamente el estado del paciente a "APTO" 
        // dependiendo de alguna bandera que mande el médico en las observaciones del seguimiento.
        
        return seguimientoRepository.save(nuevoSeguimiento);
    }
}
