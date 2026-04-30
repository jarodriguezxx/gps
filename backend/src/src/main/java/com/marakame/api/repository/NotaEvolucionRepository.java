package com.marakame.api.repository;

import com.marakame.api.entity.NotaEvolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotaEvolucionRepository extends JpaRepository<NotaEvolucion, Long> {
    // Buscamos las notas a través de la relación: Nota -> Expediente -> Paciente
    List<NotaEvolucion> findByExpediente_Paciente_IdOrderByFechaRegistroDesc(Long pacienteId);
}