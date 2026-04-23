package com.marakame.api.repository;

import com.marakame.api.entity.Baja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BajaRepository extends JpaRepository<Baja, Long> {
}
