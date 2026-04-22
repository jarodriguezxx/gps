package com.marakame.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.Paciente;
import com.marakame.api.entity.Seguimiento;
import com.marakame.api.entity.Solicitante;
import com.marakame.api.repository.PacienteRepository;
import com.marakame.api.repository.SeguimientoRepository;
import com.marakame.api.repository.SolicitanteRepository;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    public List<Paciente> obtenerPacientesParaEstudio(String query) {
        String filtro = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);

        return pacienteRepository.findAll().stream()
            .filter(paciente -> {
                if (filtro.isBlank()) {
                    return true;
                }

                return contiene(paciente.getNombreCompleto(), filtro);
            })
            .collect(Collectors.toList());
    }

    @Transactional // Esto asegura que si algo falla, no se guarde nada a medias
    public void guardarNuevoExpediente(PacienteDTO dto) {
        boolean llamadaNosotros = "nosotros".equalsIgnoreCase(dto.llamarPaciente());
        boolean llamadaPaciente = "paciente".equalsIgnoreCase(dto.llamarPaciente());
        boolean estadoVacio = dto.estadoSeguimiento() == null || dto.estadoSeguimiento().isBlank();

        Solicitante solicitante = null;
        if (dto.solicitanteId() != null) {
            solicitante = solicitanteRepository.findById(dto.solicitanteId())
                .orElseThrow(() -> new IllegalArgumentException("No existe el solicitante indicado"));
        }

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
        paciente.setSolicitante(solicitante);
        
        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        // 2. Creamos el Seguimiento inicial (lo que alimenta tus tablas del inicio)
        Seguimiento seguimiento = new Seguimiento();
        seguimiento.setPaciente(pacienteGuardado);

        String estadoSeguimiento;
        String tipoAccion;
        LocalDateTime fechaProgramada = dto.fechaCita();

        if (llamadaNosotros) {
            estadoSeguimiento = "Llamada programada por nosotros";
            tipoAccion = "Llamada";
        } else if (llamadaPaciente) {
            estadoSeguimiento = "Llamada solicitada por el paciente";
            tipoAccion = "Llamada";
        } else if (!estadoVacio) {
            estadoSeguimiento = dto.estadoSeguimiento();
            String estadoNormalizado = dto.estadoSeguimiento().toLowerCase(Locale.ROOT);
            if (estadoNormalizado.contains("llamada")) {
                tipoAccion = "Llamada";
            } else {
                tipoAccion = "Cita/Visita";
            }
        } else {
            throw new IllegalArgumentException("Selecciona un estado de seguimiento o marca que el paciente desea llamada");
        }

        seguimiento.setEstadoSeguimiento(estadoSeguimiento);
        seguimiento.setFechaHoraProgramada(fechaProgramada);
        seguimiento.setMotivo(dto.motivoAccion());
        seguimiento.setTipoAccion(tipoAccion);

        seguimientoRepository.save(seguimiento);
    }

    private boolean contiene(String texto, String filtro) {
        return texto != null && texto.toLowerCase(Locale.ROOT).contains(filtro);
    }
}