package com.marakame.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.PersonalDTO;
import com.marakame.api.entity.Personal;
import com.marakame.api.repository.PersonalRepository;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class PersonalController {

    @Autowired
    private PersonalRepository personalRepository;

    @GetMapping
    public List<Personal> obtenerTodos() {
        return personalRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Personal> registrarPersonal(@RequestBody PersonalDTO dto) {
        Personal nuevo = new Personal();
        nuevo.setNombre(dto.nombre());
        nuevo.setApellidoPaterno(dto.apellidoPaterno());
        nuevo.setApellidoMaterno(dto.apellidoMaterno());
        nuevo.setCurp(dto.curp());
        nuevo.setRfc(dto.rfc());
        nuevo.setFechaNacimiento(dto.fechaNacimiento());
        nuevo.setSexo(dto.sexo());
        nuevo.setEstadoCivil(dto.estadoCivil());
        nuevo.setTelefono(dto.telefono());
        nuevo.setCorreoElectronico(dto.correoElectronico());
        nuevo.setDomicilio(dto.domicilio());
        nuevo.setDepartamento(dto.departamento());
        nuevo.setPuesto(dto.puesto());
        nuevo.setFechaIngreso(dto.fechaIngreso());
        nuevo.setTipoContrato(dto.tipoContrato());
        nuevo.setEscolaridad(dto.escolaridad());
        nuevo.setAnosExperiencia(dto.anosExperiencia());

        Personal guardado = personalRepository.save(nuevo);
        return new ResponseEntity<>(guardado, HttpStatus.CREATED);
    }
}
