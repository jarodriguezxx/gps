package com.marakame.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.ArchivoExpediente;

@Repository
public interface ArchivoRepository extends JpaRepository<ArchivoExpediente, Long> {
    List<ArchivoExpediente> findByExpedienteId(Long expedienteId);
}
