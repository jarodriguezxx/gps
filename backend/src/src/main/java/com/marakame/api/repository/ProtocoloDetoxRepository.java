package com.marakame.api.repository;

import com.marakame.api.entity.ProtocoloDetox;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProtocoloDetoxRepository extends JpaRepository<ProtocoloDetox, Long> {
    List<ProtocoloDetox> findByPacienteId(Long pacienteId);
    List<ProtocoloDetox> findByPacienteIdAndEstado(Long pacienteId, String estado);
}
