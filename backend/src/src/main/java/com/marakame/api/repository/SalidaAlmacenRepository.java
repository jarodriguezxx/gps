package com.marakame.api.repository;

import com.marakame.api.entity.SalidaAlmacen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalidaAlmacenRepository extends JpaRepository<SalidaAlmacen, Long> {
}