package com.marakame.api.repository;

import com.marakame.api.entity.ReciboPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReciboPagoRepository extends JpaRepository<ReciboPago, Long> {
    List<ReciboPago> findByPaciente_Id(Long pacienteId);
    Optional<ReciboPago> findByTokenGenerado(String token);
    Optional<ReciboPago> findByNumeroRecibo(String numeroRecibo);
    List<ReciboPago> findByEstadoPago(String estadoPago);
}
