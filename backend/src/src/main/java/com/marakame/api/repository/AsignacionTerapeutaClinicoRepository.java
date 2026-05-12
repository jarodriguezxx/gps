package com.marakame.api.repository;

import com.marakame.api.entity.AsignacionTerapeutaClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsignacionTerapeutaClinicoRepository extends JpaRepository<AsignacionTerapeutaClinico, Long> {
    List<AsignacionTerapeutaClinico> findByPacienteId(Long pacienteId);
    Optional<AsignacionTerapeutaClinico> findByPacienteIdAndDepartamento(Long pacienteId, String departamento);
    List<AsignacionTerapeutaClinico> findByPersonalId(Long personalId);
}
