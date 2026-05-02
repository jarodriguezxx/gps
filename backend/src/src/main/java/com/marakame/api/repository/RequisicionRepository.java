package com.marakame.api.repository;

import com.marakame.api.entity.Requisicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface RequisicionRepository extends JpaRepository<Requisicion, UUID> {
}