package com.marakame.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class) // <--- CAMBIA ESTO
    @Transactional // Ahora sí funcionará porque el contexto está listo
    public void init() {
        try {
            String updateQuery = "UPDATE pacientes SET estado_paciente = 'PROSPECTO' WHERE estado_paciente IS NULL";
            int updated = jdbcTemplate.update(updateQuery);
            
            if (updated > 0) {
                System.out.println(" [DataInitializer] Actualizados " + updated + " pacientes a estado PROSPECTO");
            }
        } catch (Exception e) {
            System.err.println(" [DataInitializer] Error al inicializar datos: " + e.getMessage());
        }
    }
}