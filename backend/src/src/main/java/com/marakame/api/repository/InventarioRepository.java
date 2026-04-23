package com.marakame.api.repository;

import com.marakame.api.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    
    // Buscar productos por categoría (Ej. ver todo lo de "Médico")
    List<Inventario> findByCategoria(String categoria);
    
    // Consulta especial para el Dashboard: Traer artículos que están por debajo de su nivel mínimo
    @Query("SELECT i FROM Inventario i WHERE i.cantidadDisponible <= i.nivelMinimoAlerta")
    List<Inventario> findArticulosConStockCritico();
}