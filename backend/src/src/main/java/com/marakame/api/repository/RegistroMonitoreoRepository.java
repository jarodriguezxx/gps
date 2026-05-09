package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.RegistroMonitoreo;

@Repository
public interface RegistroMonitoreoRepository extends JpaRepository<RegistroMonitoreo, Long> {
    // Busca todos los registros de un plan, ordenados del más reciente al más antiguo
    List<RegistroMonitoreo> findByPlan_IdOrderByFechaTomaDescHoraTomaDesc(Long planId);
}
