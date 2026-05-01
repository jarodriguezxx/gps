package com.marakame.api.repository;

import com.marakame.api.entity.ValoracionMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ValoracionMedicaRepository extends JpaRepository<ValoracionMedica, Long> {
    // Este método es clave para buscar si un paciente ya fue valorado antes
    Optional<ValoracionMedica> findByPacienteId(Long pacienteId);
}