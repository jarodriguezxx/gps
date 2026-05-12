package com.marakame.api.repository;

import com.marakame.api.entity.DocumentoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentoClinicoRepository extends JpaRepository<DocumentoClinico, Long> {
    List<DocumentoClinico> findByPacienteIdOrderByFechaSubidaDesc(Long pacienteId);

package com.marakame.api.repository; // Ajusta esto a tu paquete real si es diferente

import java.util.List; // Asegúrate de que apunte a la carpeta donde pusiste tu Entidad

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marakame.api.entity.DocumentoClinico;

@Repository
public interface DocumentoClinicoRepository extends JpaRepository<DocumentoClinico, Long> {
    
    // Este método es mágico: Spring Boot lee el nombre y automáticamente crea 
    // la consulta SQL: SELECT * FROM documentos_clinicos WHERE paciente_id = ?
    List<DocumentoClinico> findByPacienteId(Long pacienteId);
    
}
