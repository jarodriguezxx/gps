package com.marakame.api.repository;

import com.marakame.api.entity.ArticuloOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArticuloOrdenCompraRepository extends JpaRepository<ArticuloOrdenCompra, UUID> {
    List<ArticuloOrdenCompra> findByOrdenCompra_Id(UUID ordenCompraId);
}
