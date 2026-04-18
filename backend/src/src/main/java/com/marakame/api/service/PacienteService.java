package com.marakame.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.Paciente;
import com.marakame.api.entity.Seguimiento;
import com.marakame.api.repository.PacienteRepository;
import com.marakame.api.repository.SeguimientoRepository;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Transactional // Esto asegura que si algo falla, no se guarde nada a medias
    public void guardarNuevoExpediente(PacienteDTO dto) {
        // 1. Creamos y guardamos al Paciente
        Paciente paciente = new Paciente();
        paciente.setNombreCompleto(dto.nombre());
        paciente.setEdad(dto.edad());
        paciente.setEstadoCivil(dto.estadocivil());
        paciente.setCantidadHijos(dto.hijos());
        paciente.setEscolaridad(dto.escolaridad());
        paciente.setOrigen(dto.origen());
        paciente.setDomicilioParticular(dto.domicilio());
        paciente.setTelefonoContacto(dto.telefono());
        paciente.setOcupacion(dto.ocupacion());
        paciente.setSustanciaConsumo(dto.sustancia());
        
        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        // 2. Creamos el Seguimiento inicial (lo que alimenta tus tablas del inicio)
        Seguimiento seguimiento = new Seguimiento();
        seguimiento.setPaciente(pacienteGuardado);
        
        // Aquí aplicamos tu lógica:
        // Si el estado es "En espera de llamada", aparecerá en la tabla de arriba.
        // Si el estado es "Posible Ingreso", aparecerá en la tabla de Citas del Día.
        seguimiento.setEstadoSeguimiento(dto.estadoSeguimiento());
        seguimiento.setFechaHoraProgramada(dto.fechaCita());
        seguimiento.setMotivo(dto.motivoAccion());
        
        // Dependiendo del estado, definimos el tipo de acción
        if(dto.estadoSeguimiento().contains("llamada")) {
            seguimiento.setTipoAccion("Llamada");
        } else {
            seguimiento.setTipoAccion("Cita/Visita");
        }

        seguimientoRepository.save(seguimiento);
    }
}