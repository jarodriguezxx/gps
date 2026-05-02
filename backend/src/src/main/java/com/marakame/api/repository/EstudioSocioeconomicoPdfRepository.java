package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.marakame.api.entity.EstudioSocioeconomicoPdf;

public interface EstudioSocioeconomicoPdfRepository extends JpaRepository<EstudioSocioeconomicoPdf, Long> {
    List<EstudioSocioeconomicoPdf> findByPacienteIdOrderByGeneradoEnDesc(Long pacienteId);

    @Query("select pdf.id, pdf.nombreArchivo, pdf.mimeType, pdf.generadoEn from EstudioSocioeconomicoPdf pdf where pdf.paciente.id = :pacienteId order by pdf.generadoEn desc")
    List<Object[]> findMetadataByPacienteIdOrderByGeneradoEnDesc(@Param("pacienteId") Long pacienteId);
}