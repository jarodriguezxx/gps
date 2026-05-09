package com.marakame.api.service;

import com.marakame.api.entity.Inventario;
import com.marakame.api.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository repository;

    // Obtener todo el inventario (Para tu Dashboard general)
    public List<Inventario> obtenerTodo() {
        return repository.findAll();
    }

    // Guardar un nuevo artículo en el inventario (Paso 5)
    public Inventario registrarArticulo(Inventario nuevoArticulo) {
        // Aquí podríamos poner validaciones, como verificar si el código de barras ya existe
        return repository.save(nuevoArticulo);
    }
}