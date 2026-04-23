package com.marakame.api.repository;

import com.marakame.api.entity.HistorialMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialMovimientoRepository extends JpaRepository<HistorialMovimiento, Long> {
    List<HistorialMovimiento> findByPersonal_IdOrderByFechaRegistroDesc(Long personalId);
}
