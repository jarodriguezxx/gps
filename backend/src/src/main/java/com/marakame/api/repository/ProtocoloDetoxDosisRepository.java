package com.marakame.api.repository;

import com.marakame.api.entity.ProtocoloDetoxDosis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProtocoloDetoxDosisRepository extends JpaRepository<ProtocoloDetoxDosis, Long> {
    List<ProtocoloDetoxDosis> findByProtocoloDetoxId(Long protocoloDetoxId);
}
