package com.marakame.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.Actividad;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    // Aquí puedes agregar después métodos como findByEstado("Pendiente") si lo necesitas
}