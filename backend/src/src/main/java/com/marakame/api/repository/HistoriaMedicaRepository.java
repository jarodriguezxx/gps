package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.HistoriaMedica;

@Repository
public interface HistoriaMedicaRepository extends JpaRepository<HistoriaMedica, Long> {
    // Para ver el historial de un paciente admitido
    List<HistoriaMedica> findByPacienteIdOrderByFechaRegistroDesc(Long pacienteId);
    
    // Para la bandeja de pre-admisión (Sin paciente asignado)
    List<HistoriaMedica> findByPacienteIsNullOrderByFechaRegistroDesc();
}