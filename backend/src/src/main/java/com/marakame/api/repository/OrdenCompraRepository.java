package com.marakame.api.repository;

import com.marakame.api.entity.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, UUID> {
    Optional<OrdenCompra> findByRequisicion_Id(UUID requisicionId);
}
