package com.marakame.api.service;

import com.marakame.api.entity.Proveedor;
import com.marakame.api.repository.ProveedorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository repository;

    public List<Proveedor> listar() {
        return repository.findAll();
    }

    @Transactional
    public Proveedor crear(Map<String, String> body) {
        Proveedor p = new Proveedor();
        p.setNombre(body.get("nombre"));
        p.setEspecialidad(body.get("especialidad"));
        p.setRfc(body.get("rfc"));
        p.setTelefono(body.get("telefono"));
        p.setCorreo(body.get("correo"));
        p.setNombreEncargado(body.get("nombreEncargado"));
        String estatus = body.getOrDefault("estatus", "ACTIVO");
        p.setEstatus(estatus.isBlank() ? "ACTIVO" : estatus);
        return repository.save(p);
    }

    @Transactional
    public Proveedor actualizar(UUID id, Map<String, String> body) {
        Proveedor p = repository.findById(id).orElseThrow(NoSuchElementException::new);
        if (body.containsKey("nombre")) p.setNombre(body.get("nombre"));
        if (body.containsKey("especialidad")) p.setEspecialidad(body.get("especialidad"));
        if (body.containsKey("rfc")) p.setRfc(body.get("rfc"));
        if (body.containsKey("telefono")) p.setTelefono(body.get("telefono"));
        if (body.containsKey("correo")) p.setCorreo(body.get("correo"));
        if (body.containsKey("nombreEncargado")) p.setNombreEncargado(body.get("nombreEncargado"));
        if (body.containsKey("estatus")) p.setEstatus(body.get("estatus"));
        return repository.save(p);
    }

    @Transactional
    public Proveedor cambiarEstatus(UUID id, String nuevoEstatus) {
        Proveedor p = repository.findById(id).orElseThrow(NoSuchElementException::new);
        p.setEstatus(nuevoEstatus);
        return repository.save(p);
    }
}
