package com.marakame.api.repository;

import com.marakame.api.entity.SeguimientoValoracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeguimientoValoracionRepository extends JpaRepository<SeguimientoValoracion, Long> {
}
