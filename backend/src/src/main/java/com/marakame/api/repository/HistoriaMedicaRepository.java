package com.marakame.api.repository; 

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.HistoriaMedica;

@Repository
public interface HistoriaMedicaRepository extends JpaRepository<HistoriaMedica, Long> {
    
    // Método clave para saber si la historia del paciente ya existe
    Optional<HistoriaMedica> findByPacienteId(Long pacienteId);
}