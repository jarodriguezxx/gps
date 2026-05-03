package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.NotaAdministrativa;

@Repository
public interface NotaAdministrativaRepository extends JpaRepository<NotaAdministrativa, Long> {
    List<NotaAdministrativa> findByExpediente_Paciente_IdOrderByFechaRegistroDesc(Long pacienteId);
}