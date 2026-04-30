package com.marakame.api.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marakame.api.dto.HistoriaMedicaDTO;
import com.marakame.api.entity.HistoriaMedica;
import com.marakame.api.entity.Paciente;
import com.marakame.api.repository.HistoriaMedicaRepository;
import com.marakame.api.repository.PacienteRepository;

@Service
public class HistoriaMedicaService {

    @Autowired
    private HistoriaMedicaRepository historiaRepo;
    @Autowired
    private PacienteRepository pacienteRepo;

    @Transactional
    public HistoriaMedica guardarHistoria(HistoriaMedicaDTO dto) {
        HistoriaMedica historia = new HistoriaMedica();
        
        // Si ya hay un paciente ID (ej. paciente re-ingresado)
        if (dto.pacienteId() != null) {
            Paciente p = pacienteRepo.findById(dto.pacienteId()).orElse(null);
            historia.setPaciente(p);
        }

        historia.setFechaRegistro(LocalDateTime.now());
        historia.setNombreProspecto(dto.nombreProspecto());
        historia.setEdadProspecto(dto.edadProspecto());
        historia.setSexoProspecto(dto.sexoProspecto());
        historia.setEstadoCivilProspecto(dto.estadoCivilProspecto());
        historia.setReligionProspecto(dto.religionProspecto());
        historia.setLugarResidencia(dto.lugarResidencia());
        historia.setLugarOrigen(dto.lugarOrigen());
        historia.setOcupacion(dto.ocupacion());
        historia.setEscolaridad(dto.escolaridad());
        historia.setHistoriaConsumo(dto.historiaConsumo());
        
        // Mapeo de listas JSONB
        historia.setSisCabeza(dto.sisCabeza());
        historia.setSisCardio(dto.sisCardio());
        historia.setSisGastro(dto.sisGastro());
        historia.setSisGenito(dto.sisGenito());
        historia.setSisNeuro(dto.sisNeuro());
        historia.setExpCabeza(dto.expCabeza());
        historia.setExpOrl(dto.expOrl());
        historia.setExpOrofaringe(dto.expOrofaringe());
        historia.setExpCuello(dto.expCuello());
        historia.setExpTorax(dto.expTorax());
        historia.setExpPulmones(dto.expPulmones());
        historia.setExpCorazon(dto.expCorazon());
        historia.setExpAbdomen(dto.expAbdomen());
        historia.setExpExtremidades(dto.expExtremidades());
        
        historia.setDiagnosticoCie10(dto.diagnosticoCie10());
        historia.setRecomendacionesPlan(dto.recomendacionesPlan());
        historia.setMedicoNombre(dto.medicoNombre());
        historia.setMedicoCedula(dto.medicoCedula());

        return historiaRepo.save(historia);
    }

    @Transactional
    public HistoriaMedica enlazarAPaciente(Long historiaId, Long pacienteId) {
        HistoriaMedica h = historiaRepo.findById(historiaId).orElseThrow();
        Paciente p = pacienteRepo.findById(pacienteId).orElseThrow();
        h.setPaciente(p);
        return historiaRepo.save(h);
    }
}