package com.marakame.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.ExpedienteMedico;

@Repository
public interface ExpedienteRepository extends JpaRepository<ExpedienteMedico, Long> {
    Optional<ExpedienteMedico> findByPacienteId(Long pacienteId);
}
