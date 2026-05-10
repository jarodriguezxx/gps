package com.marakame.api.repository;

import com.marakame.api.entity.ArticuloRequisicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ArticuloRequisicionRepository extends JpaRepository<ArticuloRequisicion, UUID> {
    // Spring Boot mágicamente crea los métodos de guardar, buscar y eliminar por nosotros.
}