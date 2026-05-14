package com.marakame.api.service;

import com.marakame.api.dto.DosisDTO;
import com.marakame.api.dto.ProtocoloDetoxDTO;
import com.marakame.api.entity.ProtocoloDetox;
import com.marakame.api.entity.ProtocoloDetoxDosis;
import com.marakame.api.repository.ProtocoloDetoxRepository;
import com.marakame.api.repository.ProtocoloDetoxDosisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProtocoloDetoxService {

    @Autowired
    private ProtocoloDetoxRepository protocoloRepository;

    @Autowired
    private ProtocoloDetoxDosisRepository dosisRepository;

    public ProtocoloDetoxDTO crearProtocolo(ProtocoloDetoxDTO dto) {
        ProtocoloDetox protocolo = new ProtocoloDetox();
        protocolo.setPacienteId(dto.getPacienteId());
        protocolo.setMedicamento(dto.getMedicamento());
        protocolo.setDuracionDias(dto.getDuracionDias());
        protocolo.setMedicoCreadoPor(dto.getMedicoCreadoPor());
        protocolo.setEstado("activo");

        ProtocoloDetox saved = protocoloRepository.save(protocolo);

        // Crear registros de dosis vacíos
        List<ProtocoloDetoxDosis> dosisList = new ArrayList<>();
        String[] horarios = {"7AM", "12PM", "6PM", "9PM"};
        
        for (int dia = 1; dia <= dto.getDuracionDias(); dia++) {
            for (String horario : horarios) {
                ProtocoloDetoxDosis dosis = new ProtocoloDetoxDosis();
                dosis.setProtocoloDetoxId(saved.getId());
                dosis.setDia(dia);
                dosis.setHorario(horario);
                dosisList.add(dosis);
            }
        }

        dosisRepository.saveAll(dosisList);
        return convertToDTO(saved);
    }

    public ProtocoloDetoxDTO actualizarDosis(Long protocoloId, List<DosisDTO> dosis) {
        Optional<ProtocoloDetox> opt = protocoloRepository.findById(protocoloId);
        if (!opt.isPresent()) {
            throw new RuntimeException("Protocolo no encontrado");
        }

        ProtocoloDetox protocolo = opt.get();

        // Actualizar dosis existentes
        for (DosisDTO dosisDTO : dosis) {
            List<ProtocoloDetoxDosis> existing = dosisRepository.findByProtocoloDetoxId(protocoloId)
                .stream()
                .filter(d -> d.getDia().equals(dosisDTO.getDia()) && d.getHorario().equals(dosisDTO.getHorario()))
                .collect(Collectors.toList());

            if (!existing.isEmpty()) {
                existing.get(0).setDosis(dosisDTO.getDosis());
                dosisRepository.save(existing.get(0));
            }
        }

        protocoloRepository.save(protocolo);
        return convertToDTO(protocolo);
    }

    public ProtocoloDetoxDTO completarProtocolo(Long protocoloId) {
        Optional<ProtocoloDetox> opt = protocoloRepository.findById(protocoloId);
        if (!opt.isPresent()) {
            throw new RuntimeException("Protocolo no encontrado");
        }

        ProtocoloDetox protocolo = opt.get();
        protocolo.setEstado("completado");
        protocoloRepository.save(protocolo);
        return convertToDTO(protocolo);
    }

    public List<ProtocoloDetoxDTO> obtenerPorPaciente(Long pacienteId) {
        List<ProtocoloDetox> protocolos = protocoloRepository.findByPacienteId(pacienteId);
        return protocolos.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ProtocoloDetoxDTO> obtenerActivosPorPaciente(Long pacienteId) {
        List<ProtocoloDetox> protocolos = protocoloRepository.findByPacienteIdAndEstado(pacienteId, "activo");
        return protocolos.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ProtocoloDetoxDTO obtenerDetalle(Long protocoloId) {
        Optional<ProtocoloDetox> opt = protocoloRepository.findById(protocoloId);
        if (!opt.isPresent()) {
            throw new RuntimeException("Protocolo no encontrado");
        }
        return convertToDTO(opt.get());
    }

    public void eliminarProtocolo(Long protocoloId) {
        protocoloRepository.deleteById(protocoloId);
    }

    private ProtocoloDetoxDTO convertToDTO(ProtocoloDetox protocolo) {
        ProtocoloDetoxDTO dto = new ProtocoloDetoxDTO();
        dto.setId(protocolo.getId());
        dto.setPacienteId(protocolo.getPacienteId());
        dto.setMedicamento(protocolo.getMedicamento());
        dto.setDuracionDias(protocolo.getDuracionDias());
        dto.setFechaCreacion(protocolo.getFechaCreacion());
        dto.setFechaActualizacion(protocolo.getFechaActualizacion());
        dto.setMedicoCreadoPor(protocolo.getMedicoCreadoPor());
        dto.setEstado(protocolo.getEstado());

        List<DosisDTO> dosisList = dosisRepository.findByProtocoloDetoxId(protocolo.getId())
            .stream()
            .map(d -> new DosisDTO(d.getDia(), d.getHorario(), d.getDosis()))
            .collect(Collectors.toList());

        dto.setDosis(dosisList);
        return dto;
    }
}
