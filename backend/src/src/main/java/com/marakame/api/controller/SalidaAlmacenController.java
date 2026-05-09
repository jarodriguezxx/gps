package com.marakame.api.controller;

import com.marakame.api.entity.Inventario;
import com.marakame.api.entity.SalidaAlmacen;
import com.marakame.api.repository.InventarioRepository;
import com.marakame.api.repository.SalidaAlmacenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/almacen/salidas")
public class SalidaAlmacenController {

    @Autowired
    private SalidaAlmacenRepository salidaRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @GetMapping
    public List<SalidaAlmacen> obtenerSalidas() {
        return salidaRepository.findAll();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> registrarSalida(@RequestBody List<SalidaAlmacen> salidas) {
        try {
            for (SalidaAlmacen salida : salidas) {
                // Buscamos con el nuevo nombre
                Optional<Inventario> itemInventario = inventarioRepository.findByNombreArticulo(salida.getArticuloNombre());
                
                if (itemInventario.isPresent()) {
                    Inventario item = itemInventario.get();
                    
                    // Verificamos stock usando getCantidadDisponible()
                    if (item.getCantidadDisponible() < salida.getCantidad()) {
                        throw new RuntimeException("No hay suficiente stock de: " + item.getNombreArticulo());
                    }
                    
                    // Restamos y guardamos
                    item.setCantidadDisponible(item.getCantidadDisponible() - salida.getCantidad());
                    inventarioRepository.save(item);
                } else {
                    throw new RuntimeException("El artículo no existe en el inventario: " + salida.getArticuloNombre());
                }
            }

            List<SalidaAlmacen> salidasGuardadas = salidaRepository.saveAll(salidas);
            return ResponseEntity.ok(salidasGuardadas);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar la salida: " + e.getMessage());
        }
    }
}