package com.marakame.api.repository;

import com.marakame.api.entity.ExpedienteClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExpedienteClinicoRepository extends JpaRepository<ExpedienteClinico, Long> {
    Optional<ExpedienteClinico> findByPacienteId(Long pacienteId);
}