package com.marakame.api.controller;

import com.marakame.api.entity.Inventario;
import com.marakame.api.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/almacen/inventario")
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @GetMapping
    public List<Inventario> obtenerInventario() {
        return inventarioRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> guardarArticulo(@RequestBody Inventario articulo) {
        try {
            // Buscamos con el nuevo nombre
            Optional<Inventario> articuloExistente = inventarioRepository.findByNombreArticulo(articulo.getNombreArticulo());
            
            if (articuloExistente.isPresent()) {
                Inventario item = articuloExistente.get();
                // Sumamos usando getCantidadDisponible
                item.setCantidadDisponible(item.getCantidadDisponible() + articulo.getCantidadDisponible());
                
                inventarioRepository.save(item);
                return ResponseEntity.ok(item);
            } else {
                Inventario guardado = inventarioRepository.save(articulo);
                return ResponseEntity.ok(guardado);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error interno en Java: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/ubicacion")
    public ResponseEntity<?> actualizarUbicacion(@PathVariable Long id, @RequestBody Inventario ubicacionNueva) {
        try {
            Optional<Inventario> itemOpt = inventarioRepository.findById(id);
            if (itemOpt.isPresent()) {
                Inventario item = itemOpt.get();
                // Usamos los nuevos nombres de ubicación
                item.setZonaAlmacen(ubicacionNueva.getZonaAlmacen());
                item.setEstante(ubicacionNueva.getEstante());
                
                inventarioRepository.save(item);
                return ResponseEntity.ok(item);
            } else {
                return ResponseEntity.badRequest().body("No se encontró el artículo con ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar ubicación: " + e.getMessage());
        }
    }
}