package com.marakame.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.PlanMonitoreo;

@Repository
public interface PlanMonitoreoRepository extends JpaRepository<PlanMonitoreo, Long> {
    // Busca si el paciente ya tiene un plan vigente de GLUCOSA o TA
    Optional<PlanMonitoreo> findByPacienteIdAndTipoAndActivoTrue(Long pacienteId, String tipo);
}