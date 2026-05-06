package com.marakame.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.ExpedienteNutricional;

@Repository
public interface ExpedienteNutricionalRepository extends JpaRepository<ExpedienteNutricional, Long> {
    ExpedienteNutricional findByPacienteId(Long pacienteId);
}
