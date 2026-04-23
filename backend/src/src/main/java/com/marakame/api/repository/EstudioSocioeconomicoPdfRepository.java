package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marakame.api.entity.EstudioSocioeconomicoPdf;

public interface EstudioSocioeconomicoPdfRepository extends JpaRepository<EstudioSocioeconomicoPdf, Long> {
    List<EstudioSocioeconomicoPdf> findByPacienteIdOrderByGeneradoEnDesc(Long pacienteId);
}