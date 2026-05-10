package com.marakame.api.controller;

import com.marakame.api.repository.InventarioRepository;
import com.marakame.api.repository.SalidaAlmacenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/almacen/stats")
public class DashboardController {

    @Autowired
    private InventarioRepository inventarioRepo;

    @Autowired
    private SalidaAlmacenRepository salidaRepo;

    @GetMapping("/resumen")
    public Map<String, Object> obtenerResumen() {
        Map<String, Object> stats = new HashMap<>();
        
        // Calculamos datos reales de la base de datos
        stats.put("totalArticulos", inventarioRepo.count());
        stats.put("totalSalidas", salidaRepo.count());
        
        // Aquí podrías agregar lógica para "Pendientes" o "Esta semana"
        stats.put("pendientes", 2); // Simulado hasta tener flujo de requisiciones completo
        stats.put("contrarecibosHoy", 1); 
        
        return stats;
    }
}