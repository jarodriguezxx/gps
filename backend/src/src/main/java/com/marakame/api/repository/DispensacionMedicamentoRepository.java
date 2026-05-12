package com.marakame.api.repository;

import com.marakame.api.entity.DispensacionMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DispensacionMedicamentoRepository extends JpaRepository<DispensacionMedicamento, Long> {
    List<DispensacionMedicamento> findAllByOrderByFechaHoraDesc();
}
