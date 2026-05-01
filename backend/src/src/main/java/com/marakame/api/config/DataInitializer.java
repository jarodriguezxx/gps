package com.marakame.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import jakarta.persistence.EntityManager;

/**
 * Inicializa datos de la BD al arrancar la aplicación
 * - Establece estado_paciente por defecto en registros existentes
 */
@Component
public class DataInitializer {

    @Autowired
    private EntityManager entityManager;

    @PostConstruct
    public void init() {
        try {
            // Actualizar pacientes existentes sin estado
            String updateQuery = "UPDATE pacientes SET estado_paciente = 'PROSPECTO' WHERE estado_paciente IS NULL";
            int updated = entityManager.createNativeQuery(updateQuery).executeUpdate();
            
            if (updated > 0) {
                System.out.println("✅ [DataInitializer] Actualizados " + updated + " pacientes a estado PROSPECTO");
            }
        } catch (Exception e) {
            System.err.println("⚠️ [DataInitializer] Error al inicializar datos: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
