package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.Seguimiento;

@Repository
public interface SeguimientoRepository extends JpaRepository<Seguimiento, Long> {
    
    // Estos métodos te servirán para filtrar los datos de tus tablas de inicio:
    
    // Para la tabla de "Llamadas en Seguimiento"
    List<Seguimiento> findByEstadoSeguimiento(String estado);
    
    // Para la tabla de "Citas del Día"
    List<Seguimiento> findByTipoAccion(String tipo);
}
