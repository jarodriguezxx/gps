package com.marakame.api.repository;

import com.marakame.api.entity.DocumentoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentoClinicoRepository extends JpaRepository<DocumentoClinico, Long> {
    List<DocumentoClinico> findByPacienteIdOrderByFechaSubidaDesc(Long pacienteId);
    List<DocumentoClinico> findByPacienteId(Long pacienteId);
}
