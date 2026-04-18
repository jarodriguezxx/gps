package com.marakame.api.repository;

import com.marakame.api.entity.Solicitante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// JpaRepository pide dos cosas: <La Entidad, El tipo de dato de su ID>
public interface SolicitanteRepository extends JpaRepository<Solicitante, Long> {
    // ¡Listo! Con esto ya tienes acceso a comandos como save(), findAll(), findById()
}