package com.marakame.api.controller;

import com.marakame.api.entity.Requisicion;
import com.marakame.api.repository.RequisicionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requisiciones")
@CrossOrigin(originPatterns = "*")
public class RequisicionController {

    @Autowired
    private RequisicionRepository repository;

    @GetMapping
    public List<Requisicion> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Requisicion create(@RequestBody Requisicion requisicion) {
        return repository.save(requisicion);
    }
}