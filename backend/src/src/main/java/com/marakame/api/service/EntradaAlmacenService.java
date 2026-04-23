package com.marakame.api.service;

import com.marakame.api.entity.EntradaAlmacen;
import com.marakame.api.repository.EntradaAlmacenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntradaAlmacenService {

    @Autowired
    private EntradaAlmacenRepository repository;

    // Obtener todas las entradas registradas
    public List<EntradaAlmacen> obtenerTodas() {
        return repository.findAll();
    }

    // Registrar una nueva entrada (Paso 1 del frontend)
    public EntradaAlmacen registrarEntrada(EntradaAlmacen nuevaEntrada) {
        // Validar que el folio no exista previamente
        if (repository.existsByFolio(nuevaEntrada.getFolio())) {
            throw new IllegalArgumentException("El folio " + nuevaEntrada.getFolio() + " ya está registrado.");
        }
        
        // Por defecto, toda entrada nueva entra en revisión
        if (nuevaEntrada.getEstado() == null) {
            nuevaEntrada.setEstado("EN_REVISION");
        }
        
        return repository.save(nuevaEntrada);
    }

    // Actualizar el estado de una entrada (Para cuando le den a "SÍ CORRESPONDE" o "NO CORRESPONDE" en el Paso 2)
    public EntradaAlmacen actualizarEstado(Long id, String nuevoEstado) {
        Optional<EntradaAlmacen> entradaOpt = repository.findById(id);
        
        if (entradaOpt.isPresent()) {
            EntradaAlmacen entrada = entradaOpt.get();
            entrada.setEstado(nuevoEstado);
            return repository.save(entrada);
        } else {
            throw new RuntimeException("Entrada no encontrada con ID: " + id);
        }
    }
}