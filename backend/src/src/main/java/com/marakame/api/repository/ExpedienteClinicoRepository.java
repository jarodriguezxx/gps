package com.marakame.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.ExpedienteClinico;

@Repository
public interface ExpedienteClinicoRepository extends JpaRepository<ExpedienteClinico, Long> {
    Optional<ExpedienteClinico> findByPacienteId(Long pacienteId);
    // Agrega este método dentro de la interfaz
    long countByEstado(String estado);
    
}

