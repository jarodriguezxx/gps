package com.marakame.api.repository;

import com.marakame.api.entity.EntradaAlmacen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntradaAlmacenRepository extends JpaRepository<EntradaAlmacen, Long> {
    
    // Spring Boot creará la consulta SQL automáticamente para buscar por estado
    List<EntradaAlmacen> findByEstado(String estado);
    
    // Para verificar si un folio ya existe y no duplicarlo
    boolean existsByFolio(String folio);
}