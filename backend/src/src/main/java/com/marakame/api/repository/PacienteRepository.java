package com.marakame.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    // Aquí podrías agregar búsquedas personalizadas después, por ahora está perfecto así.
}