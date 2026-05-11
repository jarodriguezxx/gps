package com.marakame.api.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marakame.api.dto.NotaEvolucionDTO;
import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.EstudioSocioeconomicoPdf;
import com.marakame.api.entity.ExpedienteClinico;
import com.marakame.api.entity.NotaAdministrativa;
import com.marakame.api.entity.NotaEvolucion;
import com.marakame.api.entity.Paciente;
import com.marakame.api.entity.ReciboPago;
import com.marakame.api.entity.EstadoPaciente;
import com.marakame.api.entity.Seguimiento;
import com.marakame.api.entity.Solicitante;
import com.marakame.api.repository.EstudioSocioeconomicoPdfRepository;
import com.marakame.api.repository.ExpedienteClinicoRepository;
import com.marakame.api.repository.NotaAdministrativaRepository;
import com.marakame.api.repository.NotaEvolucionRepository;
import com.marakame.api.repository.PacienteRepository;
import com.marakame.api.repository.ReciboPagoRepository;
import com.marakame.api.repository.SeguimientoRepository;
import com.marakame.api.repository.SolicitanteRepository;

@Service
public class PacienteService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    @Autowired
    private EstudioSocioeconomicoPdfRepository estudioSocioeconomicoPdfRepository;

 
    @Autowired
    private ReciboPagoRepository reciboPagoRepository;

    @Autowired
    private NotaAdministrativaRepository notaAdministrativaRepository;
    public List<Paciente> obtenerPacientesParaEstudio(String query) {
        String filtro = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);

        return pacienteRepository.findAll().stream()
            .filter(paciente -> {
                if (filtro.isBlank()) {
                    return true;
                }

                Solicitante solicitante = paciente.getSolicitante();
                return contiene(paciente.getNombreCompleto(), filtro)
                    || contiene(paciente.getNombres(), filtro)
                    || contiene(paciente.getApellidoPaterno(), filtro)
                    || contiene(paciente.getApellidoMaterno(), filtro)
                    || contiene(paciente.getTelefonoContacto(), filtro)
                    || contiene(paciente.getOrigen(), filtro)
                    || contiene(paciente.getDomicilioParticular(), filtro)
                    || (solicitante != null
                        && (contiene(solicitante.getNombre(), filtro)
                            || contiene(solicitante.getNombres(), filtro)
                            || contiene(solicitante.getApellidoPaterno(), filtro)
                            || contiene(solicitante.getApellidoMaterno(), filtro)
                            || contiene(solicitante.getTelefono(), filtro)
                            || contiene(solicitante.getCelular(), filtro)
                            || contiene(solicitante.getDomicilioParticular(), filtro)));
            })
            .collect(Collectors.toList());
    }

public Map<String, Object> obtenerDetalleExpediente(Long pacienteId) {
        ExpedienteClinico expediente = expedienteRepository.findByPacienteId(pacienteId)
        .orElseGet(() -> crearExpedienteAutomatico(pacienteId));

    // 2. Metadatos de PDFs (Usando la lógica que ya tenías)
    List<Object[]> pdfsMetadata = estudioSocioeconomicoPdfRepository.findMetadataByPacienteIdOrderByGeneradoEnDesc(pacienteId);

    // 3. Mapeo de documentos
    List<Map<String, Object>> documentos = pdfsMetadata.stream()
        .map(row -> {
            Map<String, Object> doc = new LinkedHashMap<>();
            doc.put("id", row[0]);
            doc.put("nombreArchivo", row[1]);
            doc.put("generadoEn", row[3]);
            doc.put("descargaUrl", "/api/pacientes/" + pacienteId + "/estudio-socioeconomico/pdf/" + row[0] + "/descargar");
            return doc;
        }).collect(Collectors.toList());

    // 4. Obtener las notas a través de la relación de expediente (Esto corrige el error de arranque)
    // Usamos el repositorio de notas para asegurar que traemos la información actualizada de la nueva tabla
    List<NotaEvolucion> notas = notaEvolucionRepository.findByExpediente_Paciente_IdOrderByFechaRegistroDesc(pacienteId);
    List<NotaAdministrativa> notasAdministrativas = notaAdministrativaRepository.findByExpediente_Paciente_IdOrderByFechaRegistroDesc(pacienteId);

    List<Map<String, Object>> notasAdministrativasMap = notasAdministrativas.stream()
        .map(nota -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", nota.getId());
            item.put("autor", nota.getAutor());
            item.put("estadoAnterior", nota.getEstadoAnterior());
            item.put("estadoNuevo", nota.getEstadoNuevo());
            item.put("observaciones", nota.getObservaciones());
            item.put("fechaRegistro", nota.getFechaRegistro());
            return item;
        })
        .collect(Collectors.toList());

    // 5. Respuesta unificada para React
    Map<String, Object> respuesta = new LinkedHashMap<>();
    respuesta.put("paciente", expediente.getPaciente());
    respuesta.put("expediente", Map.of(
        "id", expediente.getId(),
        "numero", expediente.getNumeroExpediente(),
        "fechaApertura", expediente.getFechaApertura(),
        "estado", expediente.getEstado()
    ));
    // CAMBIO: Enviamos la lista 'notas' que consultamos explícitamente
    respuesta.put("notasEvolucion", notas); 
    respuesta.put("notasAdministrativas", notasAdministrativasMap);
    respuesta.put("documentos", documentos);

    return respuesta;
}

// ==========================================
    // MÉTRICAS PARA EL DASHBOARD DE JEFATURA
    // ==========================================
    public Map<String, Object> obtenerMetricasDashboard() {
        // 1. Pacientes con expediente "ACTIVO"
        long pacientesActivos = expedienteRepository.countByEstado("ACTIVO");

        // 2. Total de pacientes históricos registrados
        long totalPacientes = pacienteRepository.count();

        // 3. Notas médicas creadas en las últimas 24 horas (Productividad)
        LocalDateTime hace24Horas = LocalDateTime.now().minusDays(1);
        long notasRecientes = notaEvolucionRepository.countByFechaRegistroAfter(hace24Horas);

        // 4. Construimos la respuesta
        Map<String, Object> metricas = new LinkedHashMap<>();
        metricas.put("pacientesActivos", pacientesActivos);
        metricas.put("totalPacientes", totalPacientes);
        metricas.put("notasRecientes", notasRecientes);
        
        // Aquí puedes agregar lógica futura para alertas reales
        // Por ahora lo calculamos dinámicamente si hay mucha discrepancia
        long alertasCriticas = (pacientesActivos > notasRecientes) ? (pacientesActivos - notasRecientes) : 0;
        metricas.put("alertasCriticas", alertasCriticas);

        return metricas;
    }

// Método auxiliar para crear el expediente automáticamente si no existe
    private ExpedienteClinico crearExpedienteAutomatico(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado en la base de datos"));
            
        ExpedienteClinico nuevoExpediente = new ExpedienteClinico();
        nuevoExpediente.setPaciente(paciente);
        // Genera un folio automático, ej: EXP-1-2026
        nuevoExpediente.setNumeroExpediente("EXP-" + pacienteId + "-" + LocalDateTime.now().getYear());
        nuevoExpediente.setFechaApertura(LocalDateTime.now());
        nuevoExpediente.setEstado("ACTIVO");
        
        return expedienteRepository.save(nuevoExpediente);
    }



    @Autowired
    private NotaEvolucionRepository notaEvolucionRepository;
    @Transactional
    public void agregarNotaEvolucion(Long pacienteId, NotaEvolucionDTO dto) {
        // 1. Localizar el expediente clínico maestro
        ExpedienteClinico expediente = expedienteRepository.findByPacienteId(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("No existe un expediente para este paciente"));

        // 2. Mapear todos los campos del nuevo formato oficial
        NotaEvolucion nota = new NotaEvolucion();
        nota.setExpediente(expediente);
        nota.setFechaRegistro(LocalDateTime.now());
        nota.setMedicoAsignado(dto.medicoAsignado());

        // Signos Vitales
        nota.setTa(dto.ta());
        nota.setTemp(dto.temp());
        nota.setFc(dto.fc());
        nota.setFr(dto.fr());
        nota.setPeso(dto.peso());
        nota.setTalla(dto.talla());

        // Bloques Clínicos
        nota.setEvolucionCuadroClinico(dto.evolucionCuadroClinico());
        nota.setExploracionFisica(dto.exploracionFisica());
        nota.setResultadosEstudios(dto.resultadosEstudios());
        nota.setDiagnosticoProblemas(dto.diagnosticoProblemas());
        nota.setPronosticos(dto.pronosticos());
        nota.setTratamientoIndicaciones(dto.tratamientoIndicaciones());
        nota.setObservaciones(dto.observaciones());
        nota.setFechaProximaSesion(dto.fechaProximaSesion());

        notaEvolucionRepository.save(nota);
    }

    @Transactional
    public Map<String, Object> registrarRechazoAdministrativo(Long pacienteId, String estado, String observaciones) {
        if (estado == null || !"RECHAZADO_ECONOMICO".equalsIgnoreCase(estado.trim())) {
            throw new IllegalArgumentException("Estado administrativo inválido");
        }

        if (observaciones == null || observaciones.trim().isBlank()) {
            throw new IllegalArgumentException("Las observaciones son obligatorias");
        }

        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        ExpedienteClinico expediente = expedienteRepository.findByPacienteId(pacienteId)
            .orElseGet(() -> crearExpedienteAutomatico(pacienteId));

        String estadoAnterior = paciente.getEstadoPaciente() != null ? paciente.getEstadoPaciente().name() : EstadoPaciente.PROSPECTO.name();

        paciente.setEstadoPaciente(EstadoPaciente.DENEGADO);
        pacienteRepository.save(paciente);

        expediente.setEstado(EstadoPaciente.DENEGADO.name());
        expedienteRepository.save(expediente);

        NotaAdministrativa nota = new NotaAdministrativa();
        nota.setExpediente(expediente);
        nota.setFechaRegistro(LocalDateTime.now());
        nota.setAutor("TRABAJO SOCIAL - RECHAZO");
        nota.setEstadoAnterior(estadoAnterior);
        nota.setEstadoNuevo(EstadoPaciente.DENEGADO.name());
        nota.setObservaciones(observaciones.trim());
        notaAdministrativaRepository.save(nota);

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("success", true);
        respuesta.put("estadoPaciente", paciente.getEstadoPaciente());
        respuesta.put("estadoExpediente", expediente.getEstado());
        respuesta.put("notaAdministrativa", Map.of(
            "id", nota.getId(),
            "autor", nota.getAutor(),
            "estadoAnterior", nota.getEstadoAnterior(),
            "estadoNuevo", nota.getEstadoNuevo(),
            "observaciones", nota.getObservaciones(),
            "fechaRegistro", nota.getFechaRegistro()
        ));
        return respuesta;
    }



    public Optional<EstudioSocioeconomicoPdf> obtenerPdfSocioeconomico(Long pacienteId, Long pdfId) {
        return estudioSocioeconomicoPdfRepository.findById(pdfId)
            .filter(pdf -> pdf.getPaciente() != null && pacienteId.equals(pdf.getPaciente().getId()));
    }

    private Map<String, Object> mapPaciente(Paciente paciente) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", paciente.getId());
        item.put("nombreCompleto", paciente.getNombreCompleto());
        item.put("nombres", paciente.getNombres());
        item.put("apellidoPaterno", paciente.getApellidoPaterno());
        item.put("apellidoMaterno", paciente.getApellidoMaterno());
        item.put("fechaNacimiento", paciente.getFechaNacimiento());
        item.put("sexo", paciente.getSexo());
        item.put("edad", paciente.getEdad());
        item.put("estadoCivil", paciente.getEstadoCivil());
        item.put("cantidadHijos", paciente.getCantidadHijos());
        item.put("escolaridad", paciente.getEscolaridad());
        item.put("origen", paciente.getOrigen());
        item.put("domicilioParticular", paciente.getDomicilioParticular());
        item.put("telefonoCasa", paciente.getTelefonoCasa());
        item.put("telefonoContacto", paciente.getTelefonoContacto());
        item.put("ocupacion", paciente.getOcupacion());
        item.put("sustanciaConsumo", paciente.getSustanciaConsumo());
        return item;
    }

    private Map<String, Object> mapSolicitante(Solicitante solicitante) {
        if (solicitante == null) {
            return null;
        }

        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", solicitante.getId());
        item.put("nombre", solicitante.getNombre());
        item.put("nombres", solicitante.getNombres());
        item.put("apellidoPaterno", solicitante.getApellidoPaterno());
        item.put("apellidoMaterno", solicitante.getApellidoMaterno());
        item.put("parentescoPaciente", solicitante.getParentescoPaciente());
        item.put("telefono", solicitante.getTelefono());
        item.put("celular", solicitante.getCelular());
        item.put("domicilioParticular", solicitante.getDomicilioParticular());
        item.put("ocupacion", solicitante.getOcupacion());
        return item;
    }

    @Transactional
    public void actualizarDatosBasicosEstudio(Long pacienteId, Map<String, Object> payload) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("No existe el paciente indicado"));

        Solicitante solicitante = paciente.getSolicitante();
        if (solicitante == null) {
            solicitante = new Solicitante();
            paciente.setSolicitante(solicitante);
        }

        solicitante.setNombres(valorActualizado(solicitante.getNombres(), asString(payload.get("solicitanteNombres"))));
        solicitante.setApellidoPaterno(valorActualizado(solicitante.getApellidoPaterno(), asString(payload.get("solicitanteApellidoPaterno"))));
        solicitante.setApellidoMaterno(valorActualizado(solicitante.getApellidoMaterno(), asString(payload.get("solicitanteApellidoMaterno"))));
        solicitante.setNombre(construirNombreCompleto(
            solicitante.getNombres(),
            solicitante.getApellidoPaterno(),
            solicitante.getApellidoMaterno(),
            asString(payload.get("nombreSolicitante"))
        ));
        solicitante.setFechaNacimiento(valorActualizado(solicitante.getFechaNacimiento(), asString(payload.get("fechaNacimientoSolicitante"))));
        solicitante.setEdad(valorActualizadoNumero(solicitante.getEdad(), asInteger(payload.get("edadSolicitante"))));
        solicitante.setSexo(valorActualizado(solicitante.getSexo(), asString(payload.get("sexoSolicitante"))));
        solicitante.setEscolaridad(valorActualizado(solicitante.getEscolaridad(), asString(payload.get("escolaridadSolicitante"))));
        solicitante.setEstadoCivil(valorActualizado(solicitante.getEstadoCivil(), asString(payload.get("estadoCivilSolicitante"))));
        solicitante.setLugar(valorActualizado(solicitante.getLugar(), asString(payload.get("lugarNacimientoSolicitante"))));
        solicitante.setOcupacion(valorActualizado(solicitante.getOcupacion(), asString(payload.get("ocupacionSolicitante"))));
        solicitante.setDireccionCalle(valorActualizado(solicitante.getDireccionCalle(), asString(payload.get("direccionCalleSolicitante"))));
        solicitante.setDireccionNoExt(valorActualizado(solicitante.getDireccionNoExt(), asString(payload.get("direccionNoExtSolicitante"))));
        solicitante.setDireccionNoInt(valorActualizado(solicitante.getDireccionNoInt(), asString(payload.get("direccionNoIntSolicitante"))));
        solicitante.setDireccionColonia(valorActualizado(solicitante.getDireccionColonia(), asString(payload.get("direccionColoniaSolicitante"))));
        solicitante.setDireccionMunicipioDelegacion(valorActualizado(solicitante.getDireccionMunicipioDelegacion(), asString(payload.get("direccionMunicipioDelegacionSolicitante"))));
        solicitante.setDireccionCp(valorActualizado(solicitante.getDireccionCp(), asString(payload.get("direccionCpSolicitante"))));
        solicitante.setDireccionCiudadEstado(valorActualizado(solicitante.getDireccionCiudadEstado(), asString(payload.get("direccionCiudadEstadoSolicitante"))));
        solicitante.setTelefono(valorActualizado(solicitante.getTelefono(), asString(payload.get("telefonoCasaSolicitante"))));
        solicitante.setCelular(valorActualizado(solicitante.getCelular(), asString(payload.get("telefonoCelularSolicitante"))));
        solicitante.setCuentaConTarjeta(valorActualizado(solicitante.getCuentaConTarjeta(), asString(payload.get("cuentaConTarjetaSolicitante"))));
        solicitante.setDomicilioParticular(construirDireccionCompleta(
            solicitante.getDireccionCalle(),
            solicitante.getDireccionNoExt(),
            solicitante.getDireccionNoInt(),
            solicitante.getDireccionColonia(),
            solicitante.getDireccionMunicipioDelegacion(),
            solicitante.getDireccionCp(),
            solicitante.getDireccionCiudadEstado(),
            solicitante.getDomicilioParticular()
        ));

        paciente.setNombres(valorActualizado(paciente.getNombres(), asString(payload.get("pacienteNombres"))));
        paciente.setApellidoPaterno(valorActualizado(paciente.getApellidoPaterno(), asString(payload.get("pacienteApellidoPaterno"))));
        paciente.setApellidoMaterno(valorActualizado(paciente.getApellidoMaterno(), asString(payload.get("pacienteApellidoMaterno"))));
        paciente.setNombreCompleto(construirNombreCompleto(
            paciente.getNombres(),
            paciente.getApellidoPaterno(),
            paciente.getApellidoMaterno(),
            asString(payload.get("nombrePaciente"))
        ));
        paciente.setFechaNacimiento(valorActualizado(paciente.getFechaNacimiento(), asString(payload.get("fechaNacimientoPaciente"))));
        paciente.setEdad(valorActualizadoNumero(paciente.getEdad(), asInteger(payload.get("edadPaciente"))));
        paciente.setSexo(valorActualizado(paciente.getSexo(), asString(payload.get("sexoPaciente"))));
        paciente.setEstadoCivil(valorActualizado(paciente.getEstadoCivil(), asString(payload.get("estadoCivilPaciente"))));
        paciente.setEscolaridad(valorActualizado(paciente.getEscolaridad(), asString(payload.get("escolaridadPaciente"))));
        paciente.setOcupacion(valorActualizado(paciente.getOcupacion(), asString(payload.get("ocupacionPaciente"))));
        paciente.setOrigen(valorActualizado(paciente.getOrigen(), asString(payload.get("lugarNacimientoPaciente"))));
        paciente.setDomicilioParticular(valorActualizado(paciente.getDomicilioParticular(), asString(payload.get("direccionPaciente"))));
        paciente.setTelefonoCasa(valorActualizado(paciente.getTelefonoCasa(), asString(payload.get("telefonoCasaPaciente"))));
        paciente.setTelefonoContacto(valorActualizado(paciente.getTelefonoContacto(), asString(payload.get("telefonoCelularPaciente"))));

        solicitanteRepository.save(solicitante);
        pacienteRepository.save(paciente);
    }

    @Transactional
    public void actualizarLlamadaInicial(Long pacienteId, PacienteDTO dto) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("No existe el paciente indicado"));

        Solicitante solicitante = paciente.getSolicitante();
        if (solicitante == null) {
            throw new IllegalArgumentException("El paciente no tiene solicitante vinculado para actualizar la llamada inicial");
        }

        solicitante.setNombre(dto.nombre());
        solicitante.setNombres(dto.nombres());
        solicitante.setApellidoPaterno(dto.apellidoPaterno());
        solicitante.setApellidoMaterno(dto.apellidoMaterno());
        solicitante.setEdad(dto.edad());
        solicitante.setEstadoCivil(dto.estadocivil());
        solicitante.setEscolaridad(dto.escolaridad());
        solicitante.setLugar(dto.origen());
        solicitante.setDireccionCalle(dto.direccionCalle());
        solicitante.setDireccionNoExt(dto.direccionNoExt());
        solicitante.setDireccionNoInt(dto.direccionNoInt());
        solicitante.setDireccionColonia(dto.direccionColonia());
        solicitante.setDireccionMunicipioDelegacion(dto.direccionMunicipioDelegacion());
        solicitante.setDireccionCp(dto.direccionCp());
        solicitante.setDireccionCiudadEstado(dto.direccionCiudadEstado());
        solicitante.setDomicilioParticular(construirDireccionCompleta(
            dto.direccionCalle(),
            dto.direccionNoExt(),
            dto.direccionNoInt(),
            dto.direccionColonia(),
            dto.direccionMunicipioDelegacion(),
            dto.direccionCp(),
            dto.direccionCiudadEstado(),
            dto.domicilio()
        ));
        solicitante.setTelefono(dto.telefono());
        solicitante.setCelular(dto.telefono());
        solicitante.setOcupacion(dto.ocupacion());
        solicitanteRepository.save(solicitante);

        paciente.setNombres(dto.nombres());
        paciente.setApellidoPaterno(dto.apellidoPaterno());
        paciente.setApellidoMaterno(dto.apellidoMaterno());
        paciente.setNombreCompleto(construirNombreCompleto(dto.nombres(), dto.apellidoPaterno(), dto.apellidoMaterno(), dto.nombre()));
        paciente.setEdad(dto.edad());
        paciente.setEstadoCivil(dto.estadocivil());
        paciente.setCantidadHijos(dto.hijos());
        paciente.setEscolaridad(dto.escolaridad());
        paciente.setOrigen(dto.origen());
        paciente.setDireccionCalle(dto.direccionCalle());
        paciente.setDireccionNoExt(dto.direccionNoExt());
        paciente.setDireccionNoInt(dto.direccionNoInt());
        paciente.setDireccionColonia(dto.direccionColonia());
        paciente.setDireccionMunicipioDelegacion(dto.direccionMunicipioDelegacion());
        paciente.setDireccionCp(dto.direccionCp());
        paciente.setDireccionCiudadEstado(dto.direccionCiudadEstado());
        paciente.setDomicilioParticular(construirDireccionCompleta(
            dto.direccionCalle(),
            dto.direccionNoExt(),
            dto.direccionNoInt(),
            dto.direccionColonia(),
            dto.direccionMunicipioDelegacion(),
            dto.direccionCp(),
            dto.direccionCiudadEstado(),
            dto.domicilio()
        ));
        paciente.setTelefonoContacto(dto.telefono());
        paciente.setOcupacion(dto.ocupacion());
        paciente.setSustanciaConsumo(dto.sustancia());
        pacienteRepository.save(paciente);

        List<Seguimiento> seguimientosIniciales = seguimientoRepository
            .findByPaciente_IdAndFormatoLlamadaInicialJsonIsNotNullOrderByFechaHoraProgramadaAsc(pacienteId);

        Seguimiento seguimiento = seguimientosIniciales.isEmpty() ? null : seguimientosIniciales.get(0);
        if (seguimiento == null) {
            throw new IllegalArgumentException("No existe una llamada inicial guardada para este paciente");
        }

        seguimiento.setFormatoLlamadaInicialJson(construirFormatoLlamadaInicialJson(dto, solicitante));
        seguimiento.setEstadoSeguimiento(dto.estadoSeguimiento());
        seguimiento.setMotivo(dto.motivoAccion());
        seguimiento.setFechaHoraProgramada(dto.fechaCita());
        seguimiento.setOrigenLlamada("nosotros".equalsIgnoreCase(dto.llamarPaciente()) ? "NOSOTROS" : "PROSPECTO");
        seguimiento.setTipoAccion("Llamada");
        seguimientoRepository.save(seguimiento);
    }

    @Transactional
    public EstudioSocioeconomicoPdf generarYGuardarPdfEstudio(Long pacienteId, Map<String, Object> payload) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("No existe el paciente indicado"));

        byte[] contenidoPdf = construirPdfEstudio(paciente, payload);

        EstudioSocioeconomicoPdf pdf = new EstudioSocioeconomicoPdf();
        pdf.setPaciente(paciente);
        pdf.setNombreArchivo(construirNombreArchivo(paciente));
        pdf.setMimeType("application/pdf");
        pdf.setContenidoPdf(contenidoPdf);
        pdf.setGeneradoEn(LocalDateTime.now());

        return estudioSocioeconomicoPdfRepository.save(pdf);
    }
    
    @Autowired
    private ExpedienteClinicoRepository expedienteRepository;

    @Transactional 
    public void guardarNuevoExpediente(PacienteDTO dto) {
        // 1. Crear y mapear el Paciente desde el DTO
        Paciente paciente = new Paciente();
        paciente.setNombres(dto.nombres());
        paciente.setApellidoPaterno(dto.apellidoPaterno());
        paciente.setApellidoMaterno(dto.apellidoMaterno());
        paciente.setNombreCompleto(dto.nombre());
        paciente.setEdad(dto.edad());
        paciente.setEstadoCivil(dto.estadocivil());
        paciente.setTelefonoContacto(dto.telefono());
        paciente.setSustanciaConsumo(dto.sustancia());
        // ... agrega los setters restantes que ya tenías

        // 1.5 Vincular el solicitante si viene en el DTO
        if (dto.solicitanteId() != null && dto.solicitanteId() > 0) {
            Solicitante solicitante = solicitanteRepository.findById(dto.solicitanteId())
                .orElseThrow(() -> new IllegalArgumentException("Solicitante no encontrado con ID: " + dto.solicitanteId()));
            paciente.setSolicitante(solicitante);
        }

        // 2. Guardar paciente para generar su ID
        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        // 3. Crear el Expediente Clínico Maestro asociado al Paciente
        ExpedienteClinico nuevoExpediente = new ExpedienteClinico();
        nuevoExpediente.setPaciente(pacienteGuardado);
        nuevoExpediente.setFechaApertura(LocalDateTime.now());
        nuevoExpediente.setEstado("ACTIVO");
        nuevoExpediente.setNumeroExpediente("MK-" + pacienteGuardado.getId()); 
        
        expedienteRepository.save(nuevoExpediente);

        // 4. Crear el primer Seguimiento Administrativo
        Seguimiento seguimiento = new Seguimiento();
        seguimiento.setPaciente(pacienteGuardado);
        seguimiento.setTipoAccion("Apertura de Expediente");
        seguimiento.setEstadoSeguimiento(dto.estadoSeguimiento());
        seguimiento.setFechaHoraProgramada(dto.fechaCita());
        seguimiento.setMotivo(dto.motivoAccion());
        
        seguimientoRepository.save(seguimiento);
    }



    private String construirFormatoLlamadaInicialJson(PacienteDTO dto, Solicitante solicitante) {
        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("solicitante", construirSnapshotSolicitante(solicitante));
        snapshot.put("paciente", construirSnapshotPaciente(dto));
        snapshot.put("llamarPaciente", dto.llamarPaciente());
        snapshot.put("estadoSeguimiento", dto.estadoSeguimiento());
        snapshot.put("fechaCita", dto.fechaCita());
        snapshot.put("motivoAccion", dto.motivoAccion());

        try {
            return objectMapper.writeValueAsString(snapshot);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private Map<String, Object> construirSnapshotSolicitante(Solicitante solicitante) {
        Map<String, Object> data = new LinkedHashMap<>();
        if (solicitante == null) {
            return data;
        }

        data.put("nombre", solicitante.getNombre());
        data.put("nombres", solicitante.getNombres());
        data.put("apellidoPaterno", solicitante.getApellidoPaterno());
        data.put("apellidoMaterno", solicitante.getApellidoMaterno());
        data.put("edad", solicitante.getEdad());
        data.put("estadoCivil", solicitante.getEstadoCivil());
        data.put("escolaridad", solicitante.getEscolaridad());
        data.put("origen", solicitante.getLugar());
        data.put("direccionCalle", solicitante.getDireccionCalle());
        data.put("direccionNoExt", solicitante.getDireccionNoExt());
        data.put("direccionNoInt", solicitante.getDireccionNoInt());
        data.put("direccionColonia", solicitante.getDireccionColonia());
        data.put("direccionMunicipioDelegacion", solicitante.getDireccionMunicipioDelegacion());
        data.put("direccionCp", solicitante.getDireccionCp());
        data.put("direccionCiudadEstado", solicitante.getDireccionCiudadEstado());
        data.put("domicilio", solicitante.getDomicilioParticular());
        data.put("telefono", solicitante.getTelefono());
        data.put("celular", solicitante.getCelular());
        data.put("ocupacion", solicitante.getOcupacion());
        data.put("parentescoPaciente", solicitante.getParentescoPaciente());
        data.put("cuentaConTarjeta", solicitante.getCuentaConTarjeta());
        return data;
    }

    private Map<String, Object> construirSnapshotPaciente(PacienteDTO dto) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("nombre", dto.nombre());
        data.put("nombres", dto.nombres());
        data.put("apellidoPaterno", dto.apellidoPaterno());
        data.put("apellidoMaterno", dto.apellidoMaterno());
        data.put("edad", dto.edad());
        data.put("estadoCivil", dto.estadocivil());
        data.put("hijos", dto.hijos());
        data.put("escolaridad", dto.escolaridad());
        data.put("origen", dto.origen());
        data.put("direccionCalle", dto.direccionCalle());
        data.put("direccionNoExt", dto.direccionNoExt());
        data.put("direccionNoInt", dto.direccionNoInt());
        data.put("direccionColonia", dto.direccionColonia());
        data.put("direccionMunicipioDelegacion", dto.direccionMunicipioDelegacion());
        data.put("direccionCp", dto.direccionCp());
        data.put("direccionCiudadEstado", dto.direccionCiudadEstado());
        data.put("domicilio", dto.domicilio());
        data.put("telefono", dto.telefono());
        data.put("ocupacion", dto.ocupacion());
        data.put("sustancia", dto.sustancia());
        return data;
    }

    private Map<String, Object> leerFormatoLlamadaInicial(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }

        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return Map.of("raw", json);
        }
    }

    private boolean contiene(String texto, String filtro) {
        return texto != null && normalizarTexto(texto).contains(normalizarTexto(filtro));
    }

    private String normalizarTexto(String texto) {
        String normalizado = Normalizer.normalize(texto, Normalizer.Form.NFD);
        normalizado = normalizado.replaceAll("\\p{M}+", "");
        return normalizado.toLowerCase(Locale.ROOT).trim();
    }

    private String construirDireccionCompleta(
        String calle,
        String noExt,
        String noInt,
        String colonia,
        String municipioDelegacion,
        String cp,
        String ciudadEstado,
        String fallback
    ) {
        StringBuilder direccion = new StringBuilder();

        agregarParte(direccion, calle);
        agregarParte(direccion, noExt == null || noExt.isBlank() ? null : "No. Ext. " + noExt);
        agregarParte(direccion, noInt == null || noInt.isBlank() ? null : "No. Int. " + noInt);
        agregarParte(direccion, colonia);
        agregarParte(direccion, municipioDelegacion);
        agregarParte(direccion, cp);
        agregarParte(direccion, ciudadEstado);

        if (direccion.length() > 0) {
            return direccion.toString();
        }

        return fallback;
    }

    private void agregarParte(StringBuilder direccion, String parte) {
        if (parte == null || parte.isBlank()) {
            return;
        }

        if (direccion.length() > 0) {
            direccion.append(", ");
        }
        direccion.append(parte.trim());
    }

    private String construirNombreCompleto(String nombres, String apellidoPaterno, String apellidoMaterno, String fallback) {
        StringBuilder nombreCompleto = new StringBuilder();
        agregarParteConEspacio(nombreCompleto, nombres);
        agregarParteConEspacio(nombreCompleto, apellidoPaterno);
        agregarParteConEspacio(nombreCompleto, apellidoMaterno);

        if (nombreCompleto.length() > 0) {
            return nombreCompleto.toString();
        }

        return fallback;
    }

    private void agregarParteConEspacio(StringBuilder valor, String parte) {
        if (parte == null || parte.isBlank()) {
            return;
        }
        if (valor.length() > 0) {
            valor.append(' ');
        }
        valor.append(parte.trim());
    }

    private String asString(Object value) {
        if (value == null) {
            return null;
        }
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? null : text;
    }

    private Integer asInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String text) {
            String trimmed = text.trim();
            if (trimmed.isEmpty()) {
                return null;
            }
            try {
                return Integer.valueOf(trimmed);
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }

    private String valorActualizado(String actual, String nuevo) {
        return nuevo == null ? actual : nuevo;
    }

    private Integer valorActualizadoNumero(Integer actual, Integer nuevo) {
        return nuevo == null ? actual : nuevo;
    }

    private byte[] construirPdfEstudio(Paciente paciente, Map<String, Object> payload) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDFont regular = PDType1Font.HELVETICA;
            PDFont bold = PDType1Font.HELVETICA_BOLD;
            LocalDateTime generadoEn = LocalDateTime.now();

            Object estudio = payload.get("estudio");
            Map<?, ?> estudioData = estudio instanceof Map<?, ?> estudioMap ? estudioMap : payload;
            Map<String, String> formularioPlano = aplanarFormulario(estudioData);

            try (PdfLayoutState pdf = new PdfLayoutState(document)) {
                pdf.escribirFormatoEstructurado(
                    paciente,
                    paciente.getSolicitante(),
                    generadoEn,
                    estudioData,
                    formularioPlano,
                    bold,
                    regular
                );
            }

            document.save(output);
            return output.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("No fue posible generar el PDF del estudio socioeconomico", e);
        }
    }

    private String construirNombreArchivo(Paciente paciente) {
        String nombre = paciente.getNombreCompleto() == null
            ? "paciente"
            : paciente.getNombreCompleto().replaceAll("[^a-zA-Z0-9]+", "_").toLowerCase(Locale.ROOT);
        return "estudio_socioeconomico_" + nombre + "_" + System.currentTimeMillis() + ".pdf";
    }

    private String limpiarTextoPdf(String texto) {
        if (texto == null) {
            return "";
        }
        return texto.replace("\r", " ").replace("\n", " ").trim();
    }

    private String formatearFechaHora(LocalDateTime fecha) {
        if (fecha == null) {
            return "";
        }
        return fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    private Map<String, String> aplanarFormulario(Map<?, ?> data) {
        Map<String, String> plano = new LinkedHashMap<>();
        if (data == null) {
            return plano;
        }

        for (Map.Entry<?, ?> entry : data.entrySet()) {
            aplanarRecursivo(String.valueOf(entry.getKey()), entry.getValue(), plano);
        }
        return plano;
    }

    private void aplanarRecursivo(String prefijo, Object value, Map<String, String> plano) {
        if (value instanceof Map<?, ?> mapa) {
            for (Map.Entry<?, ?> nested : mapa.entrySet()) {
                aplanarRecursivo(prefijo + "_" + nested.getKey(), nested.getValue(), plano);
            }
            return;
        }

        if (value instanceof Iterable<?> iterable) {
            List<String> partes = new ArrayList<>();
            int index = 1;
            for (Object item : iterable) {
                if (item instanceof Map<?, ?> itemMap) {
                    for (Map.Entry<?, ?> nested : itemMap.entrySet()) {
                        aplanarRecursivo(prefijo + "_" + index + "_" + nested.getKey(), nested.getValue(), plano);
                    }
                } else {
                    partes.add(valorTexto(item));
                }
                index++;
            }
            if (!partes.isEmpty()) {
                plano.put(prefijo, String.join(" | ", partes));
            }
            return;
        }

        plano.put(prefijo, valorTexto(value));
    }

    private String buscarValorFormulario(Map<String, String> formularioPlano, String... claves) {
        if (formularioPlano == null || formularioPlano.isEmpty()) {
            return "";
        }

        for (String clave : claves) {
            String claveNormalizada = normalizarClave(clave);

            for (Map.Entry<String, String> entry : formularioPlano.entrySet()) {
                String key = normalizarClave(entry.getKey());
                String valor = entry.getValue();
                if (key.equals(claveNormalizada) && valor != null && !valor.isBlank()) {
                    return valor;
                }
            }

            for (Map.Entry<String, String> entry : formularioPlano.entrySet()) {
                String key = normalizarClave(entry.getKey());
                String valor = entry.getValue();
                if (valor == null || valor.isBlank()) {
                    continue;
                }

                if (key.contains(claveNormalizada) || claveNormalizada.contains(key)) {
                    return valor;
                }
            }
        }

        return "";
    }

    private String valorDisponible(String principal, Object fallback) {
        if (principal != null && !principal.isBlank()) {
            return principal;
        }
        return fallback == null ? "" : String.valueOf(fallback);
    }

    private String normalizarClave(String clave) {
        if (clave == null) {
            return "";
        }
        return clave.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }

    private String valorTexto(Object value) {
        if (value == null) {
            return "";
        }

        if (value instanceof Map<?, ?> map) {
            return map.toString();
        }

        if (value instanceof Iterable<?> iterable) {
            List<String> partes = new ArrayList<>();
            for (Object item : iterable) {
                partes.add(valorTexto(item));
            }
            return String.join(" | ", partes);
        }

        return String.valueOf(value);
    }

    private final class PdfLayoutState implements AutoCloseable {
        private static final float LEFT_MARGIN = 50f;
        private static final float RIGHT_MARGIN = 50f;
        private static final float TOP_MARGIN = 742f;
        private static final float BOTTOM_MARGIN = 52f;
        private static final float LINE_STEP = 13f;
        private static final float SECTION_SPACING = 8f;
        private static final float CONTENT_WIDTH = PDRectangle.LETTER.getWidth() - LEFT_MARGIN - RIGHT_MARGIN;
        private static final float CONTENT_RIGHT = PDRectangle.LETTER.getWidth() - RIGHT_MARGIN;
        private static final float MIDDLE_X = LEFT_MARGIN + (CONTENT_WIDTH / 2f);

        private final PDDocument document;
        private PDPageContentStream contentStream;
        private float cursorY;

        private PdfLayoutState(PDDocument document) throws IOException {
            this.document = document;
            abrirNuevaPagina();
        }

        private void abrirNuevaPagina() throws IOException {
            cerrarFlujoActual();
            PDPage page = new PDPage(PDRectangle.LETTER);
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
            cursorY = TOP_MARGIN;
        }

        private void asegurarEspacio(float requerido) throws IOException {
            if (cursorY - requerido < BOTTOM_MARGIN) {
                abrirNuevaPagina();
            }
        }

        private void abrirNuevaPaginaConCabecera(LocalDateTime fecha, PDFont regular) throws IOException {
            abrirNuevaPagina();
            escribirTexto("Marakame - Estudio Socioeconomico", regular, 10, LEFT_MARGIN, cursorY);
            escribirTextoAlineadoDerecha(formatearFechaHora(fecha), regular, 10, CONTENT_RIGHT, cursorY);
            cursorY -= 6;
            dibujarLinea(LEFT_MARGIN, cursorY, CONTENT_RIGHT);
            cursorY -= 12;
        }

        private void escribirFormatoEstructurado(
            Paciente paciente,
            Solicitante solicitante,
            LocalDateTime generadoEn,
            Map<?, ?> estudioRaw,
            Map<String, String> formulario,
            PDFont bold,
            PDFont regular
        ) throws IOException {
            escribirEncabezadoPrincipal(generadoEn, paciente, bold, regular);
            escribirBloqueSolicitante(solicitante, formulario, bold, regular);
            escribirBloqueBeneficiario(paciente, estudioRaw, formulario, bold, regular);

            abrirNuevaPaginaConCabecera(generadoEn, regular);
            escribirBloqueIngresoEgreso(formulario, bold, regular);
            escribirBloqueSaludAdicciones(formulario, bold, regular);

            abrirNuevaPaginaConCabecera(generadoEn, regular);
            escribirBloqueVivienda(formulario, bold, regular);
            escribirBloqueAlimentacion(formulario, bold, regular);
            escribirBloqueDiagnostico(formulario, bold, regular);

            abrirNuevaPaginaConCabecera(generadoEn, regular);
            escribirBloqueObservaciones(formulario, bold, regular);
            escribirNotaYFirmas(bold, regular);
        }

        private void escribirEncabezadoPrincipal(LocalDateTime generadoEn, Paciente paciente, PDFont bold, PDFont regular) throws IOException {
            asegurarEspacio(84f);
            escribirTextoCentrado("ESTUDIO SOCIOECONOMICO", bold, 15, cursorY - 6);
            cursorY -= 30;
            escribirLineaDoble("FECHA", formatearFechaHora(generadoEn), "FOLIO", construirFolio(paciente), regular);
            cursorY -= 4;
        }

        private void escribirBloqueSolicitante(Solicitante solicitante, Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            String domicilioSolicitante = valorDisponible(
                buscarValorFormulario(form, "direccionactualsolicitante", "domicilioparticularsolicitante", "direccionactual"),
                solicitante == null ? "" : solicitante.getDomicilioParticular()
            );
            String telefonoSolicitante = valorDisponible(
                buscarValorFormulario(form, "telefonocasasolicitante"),
                solicitante == null ? "" : solicitante.getTelefono()
            );
            String celularSolicitante = valorDisponible(
                buscarValorFormulario(form, "telefonocelularsolicitante"),
                solicitante == null ? "" : solicitante.getCelular()
            );

            escribirTituloSeccion("I. DATOS GENERALES DEL SOLICITANTE", bold);
            escribirLineaSimple("Nombre", valorDisponible(
                buscarValorFormulario(form, "nombresolicitante", "solicitantenombre"),
                solicitante == null ? "" : solicitante.getNombre()
            ), regular);
            escribirLineaDoble(
                "Fecha de nacimiento",
                valorDisponible(buscarValorFormulario(form, "fechanacimientosolicitante"), solicitante == null ? "" : solicitante.getFechaNacimiento()),
                "Lugar",
                buscarValorFormulario(form, "lugarnacimientosolicitante", "lugar") ,
                regular
            );
            escribirLineaTriple(
                "Edad", valorDisponible(buscarValorFormulario(form, "edadsolicitante"), solicitante == null ? "" : solicitante.getEdad()),
                "Sexo", valorDisponible(buscarValorFormulario(form, "sexosolicitante"), solicitante == null ? "" : solicitante.getSexo()),
                "Escolaridad", valorDisponible(buscarValorFormulario(form, "escolaridadsolicitante"), solicitante == null ? "" : solicitante.getEscolaridad()),
                regular
            );
            escribirLineaDoble(
                "Ocupacion",
                valorDisponible(buscarValorFormulario(form, "ocupacionsolicitante"), solicitante == null ? "" : solicitante.getOcupacion()),
                "Estado civil",
                valorDisponible(buscarValorFormulario(form, "estadocivilsolicitante"), solicitante == null ? "" : solicitante.getEstadoCivil()),
                regular
            );

            escribirSubtituloSimple("REFERENCIA DE DOMICILIO", bold);
            List<String[]> filasReferenciaDomicilio = new ArrayList<>();
            filasReferenciaDomicilio.add(new String[] {
                domicilioSolicitante,
                telefonoSolicitante,
                celularSolicitante,
                valorDisponible(buscarValorFormulario(form, "parentescopaciente", "parentesco"), solicitante == null ? "" : solicitante.getParentescoPaciente())
            });
            escribirTabla(
                new String[] {"Domicilio", "Telefono", "Celular", "Parentesco"},
                1,
                new float[] {275f, 90f, 90f, 75f},
                16f,
                bold,
                regular,
                filasReferenciaDomicilio
            );

            escribirLineaDoble(
                "No. Telefonico",
                telefonoSolicitante,
                "Telefono Celular",
                celularSolicitante,
                regular
            );
            escribirLineaSimple("Cuenta con tarjeta (credito/debito/ahorro)", buscarValorFormulario(form, "cuentacontarjetasolicitante", "tarjeta"), regular);
            escribirLineaSimple("Referencias", buscarValorFormulario(form, "referencias", "referenciaspersonales"), regular);
            cursorY -= SECTION_SPACING;
        }

        private void escribirBloqueBeneficiario(
            Paciente paciente,
            Map<?, ?> estudioRaw,
            Map<String, String> form,
            PDFont bold,
            PDFont regular
        ) throws IOException {
            escribirTituloSeccion("DATOS GENERALES DEL BENEFICIARIO", bold);
            escribirLineaSimple("Nombre", valorDisponible(buscarValorFormulario(form, "nombrepaciente", "beneficiarionombre"), paciente.getNombreCompleto()), regular);
            escribirLineaDoble(
                "Fecha de nacimiento",
                valorDisponible(buscarValorFormulario(form, "fechanacimientopaciente"), paciente.getFechaNacimiento()),
                "Lugar",
                valorDisponible(buscarValorFormulario(form, "lugarnacimientopaciente", "lugarnacimiento"), paciente.getOrigen()),
                regular
            );
            escribirLineaTriple(
                "Edad", valorDisponible(buscarValorFormulario(form, "edadpaciente"), paciente.getEdad()),
                "Sexo", valorDisponible(buscarValorFormulario(form, "sexopaciente"), paciente.getSexo()),
                "Escolaridad", valorDisponible(buscarValorFormulario(form, "escolaridadpaciente"), paciente.getEscolaridad()),
                regular
            );
            escribirLineaDoble(
                "Ocupacion",
                valorDisponible(buscarValorFormulario(form, "ocupacionpaciente"), paciente.getOcupacion()),
                "Estado civil",
                valorDisponible(buscarValorFormulario(form, "estadocivilpaciente"), paciente.getEstadoCivil()),
                regular
            );
            escribirLineaSimple("Direccion actual", valorDisponible(buscarValorFormulario(form, "direccionpaciente"), paciente.getDomicilioParticular()), regular);
            escribirLineaDoble(
                "No. Telefonico",
                valorDisponible(buscarValorFormulario(form, "telefonocasapaciente"), paciente.getTelefonoCasa()),
                "Telefono Celular",
                valorDisponible(buscarValorFormulario(form, "telefonocelularpaciente"), paciente.getTelefonoContacto()),
                regular
            );

            escribirSubtituloSimple("Estructura familiar (personas que habitan en el domicilio)", regular);
            List<String[]> filasFamilia = extraerFilasFamiliaDesdeRaw(estudioRaw, 8);
            if (filasFamilia.isEmpty()) {
                filasFamilia = extraerFilasIndexadas(
                    form,
                    new String[] {"householdmembers", "estructurafamiliar", "familiar", "integrante", "personashabitan"},
                    new String[] {"nombre", "parentesco", "edad", "sexo", "estadocivil", "ocupacion", "ocupacionlugar"},
                    8
                );
            }
            escribirTabla(
                new String[] {"Nombre", "Parentesco", "Edad", "Sexo", "Edo. Civil", "Ocupacion/Lugar"},
                8,
                new float[] {160f, 72f, 40f, 40f, 70f, 130f},
                15f,
                bold,
                regular,
                filasFamilia
            );
            cursorY -= SECTION_SPACING;
        }

        private void escribirBloqueIngresoEgreso(Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            escribirTituloSeccion("II. INGRESO Y EGRESO FAMILIAR", bold);
            escribirLineaDoble("Cuenta con empleo actual", buscarValorFormulario(form, "formdata_laboralcuentaconempleo", "cuentaconempleoactual", "empleoactual"), "Empresa en la que labora", buscarValorFormulario(form, "formdata_laborallugartrabajo", "empresa", "empresalabora"), regular);
            escribirLineaDoble("Antiguedad", buscarValorFormulario(form, "formdata_laboralantiguedad", "antiguedad"), "Puesto que ocupa", buscarValorFormulario(form, "formdata_laboralpuesto", "puesto"), regular);
            escribirLineaDoble("Horario de trabajo", buscarValorFormulario(form, "formdata_laboralhorario", "horario"), "Dependientes economicos", buscarValorFormulario(form, "formdata_laboraldependientes", "dependienteseconomicos"), regular);
            escribirLineaDoble("Ingreso mensual neto", buscarValorFormulario(form, "formdata_laboralingresomensual", "ingresomensual", "ingresomensualneto"), "Otros ingresos", buscarValorFormulario(form, "formdata_laboralotrosingresos", "otrosingresos"), regular);

            String conyugeOcup  = buscarValorFormulario(form, "formdata_conyugeOcupacion",      "conyugeocupacion");
            String conyugeLugar = buscarValorFormulario(form, "formdata_conyugeLugarTrabajo",   "conyugelugartrabajo");
            String conyugeAntig = buscarValorFormulario(form, "formdata_conyugeAntiguedad",     "conyugeantiguedad");
            String conyugeIngr  = buscarValorFormulario(form, "formdata_conyugeIngresoMensual", "conyugeingresomensual");
            if (!conyugeOcup.isBlank() || !conyugeLugar.isBlank() || !conyugeAntig.isBlank() || !conyugeIngr.isBlank()) {
                escribirSubtituloSimple("DATOS LABORALES DEL CONYUGE", bold);
                escribirLineaDoble("Ocupacion", conyugeOcup, "Lugar de trabajo", conyugeLugar, regular);
                escribirLineaDoble("Antiguedad", conyugeAntig, "Ingreso mensual neto", conyugeIngr, regular);
            }

            String tieneAuto = buscarValorFormulario(form, "formdata_patrimonioCuentaAuto", "patrimoniocuentaauto");
            if (!tieneAuto.isBlank()) {
                escribirSubtituloSimple("TRANSPORTE / PATRIMONIO", bold);
                String cantAutos = buscarValorFormulario(form, "formdata_patrimonioCantidad", "patrimoniocantidad");
                String catVeh    = buscarValorFormulario(form, "formdata_vehiculoCategoria",  "vehiculocategoria");
                escribirLineaTriple("Cuenta con automovil", tieneAuto, "Cantidad", cantAutos, "Categoria", catVeh, regular);
                List<String[]> filasVeh = extraerFilasVehiculos(form);
                if (!filasVeh.isEmpty()) {
                    escribirTabla(
                        new String[]{"Marca", "Anio", "Propietario"},
                        Math.max(filasVeh.size(), 2),
                        new float[]{170f, 80f, 165f},
                        14f, bold, regular, filasVeh
                    );
                }
            }

            String familiarAporta = buscarValorFormulario(form, "formdata_familiarAportaIngreso", "familiaraportaingreso");
            if (!familiarAporta.isBlank()) {
                escribirSubtituloSimple("APORTACION FAMILIAR AL INGRESO", bold);
                String numAporta = buscarValorFormulario(form, "formdata_numeroIntegrantesAportan", "numerointegratesaportan");
                escribirLineaDoble("Otro miembro aporta al ingreso", familiarAporta, "Integrantes que aportan", numAporta, regular);
                List<String[]> filasContrib = extraerFilasContribuidores(form);
                if (!filasContrib.isEmpty()) {
                    escribirTabla(
                        new String[]{"Parentesco", "Cantidad mensual"},
                        Math.max(filasContrib.size(), 2),
                        new float[]{250f, 165f},
                        14f, bold, regular, filasContrib
                    );
                }
            }

            escribirSubtituloSimple("III. INGRESOS MENSUALES / EGRESOS MENSUALES", bold);

            String[] ingLabels = {"Solicitante", "Esposo(a)/Conyuge", "Hijos", "Otros"};
            String[] ingKeys   = {"monthlyIncomes_solicitante", "monthlyIncomes_conyuge", "monthlyIncomes_hijos", "monthlyIncomes_otros"};
            String[] egLabels  = {"Alimentacion", "Renta", "Luz", "Agua", "Combustible", "Transporte", "Educacion", "Telefono", "Gastos medicos", "Esparcimiento", "Otros"};
            String[] egKeys    = {"monthlyExpenses_alimentacion", "monthlyExpenses_renta", "monthlyExpenses_luz", "monthlyExpenses_agua", "monthlyExpenses_combustible", "monthlyExpenses_transporte", "monthlyExpenses_educacion", "monthlyExpenses_telefono", "monthlyExpenses_gastosMedicos", "monthlyExpenses_esparcimiento", "monthlyExpenses_otros"};

            int ingRows   = ingLabels.length;
            int egRows    = egLabels.length;
            int totalRows = Math.max(ingRows, egRows);
            float rowH    = 14f;
            float headerH = 16f;
            float totalH  = headerH + (totalRows * rowH);

            asegurarEspacio(totalH + 8);
            float tablaTop = cursorY;

            float ingBoxW  = 220f;
            float ingLabelW = 148f;
            float egBoxX   = LEFT_MARGIN + 250;
            float egBoxW   = 260f;
            float egLabelW = 172f;

            dibujarCaja(LEFT_MARGIN, tablaTop - totalH, ingBoxW, totalH);
            dibujarCaja(egBoxX, tablaTop - totalH, egBoxW, totalH);
            dibujarLinea(LEFT_MARGIN, tablaTop - headerH, LEFT_MARGIN + ingBoxW);
            dibujarLinea(egBoxX, tablaTop - headerH, egBoxX + egBoxW);
            dibujarLineaVertical(LEFT_MARGIN + ingLabelW, tablaTop, tablaTop - totalH);
            dibujarLineaVertical(egBoxX + egLabelW, tablaTop, tablaTop - totalH);

            for (int i = 1; i <= totalRows; i++) {
                float lineY = tablaTop - headerH - (i * rowH);
                dibujarLinea(LEFT_MARGIN, lineY, LEFT_MARGIN + ingBoxW);
                dibujarLinea(egBoxX, lineY, egBoxX + egBoxW);
            }

            escribirTexto("INGRESOS MENSUALES", bold, 9, LEFT_MARGIN + 4, tablaTop - 12);
            escribirTexto("EGRESOS MENSUALES",  bold, 9, egBoxX + 4,      tablaTop - 12);

            float ingValW = ingBoxW - ingLabelW;
            float egValW  = egBoxW - egLabelW;

            for (int i = 0; i < ingLabels.length; i++) {
                float y = tablaTop - headerH - (i * rowH) - (rowH * 0.7f);
                String val = buscarValorFormulario(form, ingKeys[i]);
                escribirTextoRecortado(ingLabels[i], regular, 8.5f, LEFT_MARGIN + 3, y, ingLabelW - 6);
                if (!val.isBlank()) {
                    escribirTextoRecortado("$ " + val, regular, 8.5f, LEFT_MARGIN + ingLabelW + 2, y, ingValW - 4);
                }
            }

            for (int i = 0; i < egLabels.length; i++) {
                float y = tablaTop - headerH - (i * rowH) - (rowH * 0.7f);
                String val = buscarValorFormulario(form, egKeys[i]);
                escribirTextoRecortado(egLabels[i], regular, 8.5f, egBoxX + 3, y, egLabelW - 6);
                if (!val.isBlank()) {
                    escribirTextoRecortado("$ " + val, regular, 8.5f, egBoxX + egLabelW + 2, y, egValW - 4);
                }
            }

            cursorY = tablaTop - totalH - 8;
        }

        private void escribirBloqueSaludAdicciones(Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            escribirTituloSeccion("III. SALUD Y ADICCIONES", bold);
            escribirSubtituloSimple("ASISTENCIA MEDICA", bold);
            escribirLineaDoble("ISSSTE / IMSS / Seguro Popular", buscarValorFormulario(form, "asistenciamedica", "seguro"), "Consulta particular", buscarValorFormulario(form, "consultaparticular"), regular);
            escribirLineaDoble("Monto en consultas", buscarValorFormulario(form, "montoenconsultas"), "Otros", buscarValorFormulario(form, "asistenciaotros"), regular);
            escribirLineaSimple("Miembros con asistencia medica", buscarValorFormulario(form, "miembrosasistenciamedica"), regular);

            escribirSubtituloSimple("ADICCIONES", bold);
            escribirLineaDoble("Alcoholismo", buscarValorFormulario(form, "alcoholismo"), "TCA/Ludopatia", buscarValorFormulario(form, "tca", "ludopatia"), regular);
            escribirLineaDoble("Drogadiccion", buscarValorFormulario(form, "drogadiccion"), "Otros", buscarValorFormulario(form, "adiccionesotros"), regular);
            escribirLineaSimple("Relacion familiar", buscarValorFormulario(form, "relacionfamiliar"), regular);
            cursorY -= SECTION_SPACING;
        }

        private void escribirBloqueVivienda(Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            escribirTituloSeccion("IV. VIVIENDA", bold);
            escribirLineaDoble(
                "Regimen de vivienda",
                buscarValorFormulario(form, "formdata_viviendaregimen", "regimendevivienda"),
                "Tipo de vivienda",
                buscarValorFormulario(form, "formdata_viviendatipo", "tipodevivienda"),
                regular
            );
            escribirLineaDoble(
                "Espacio (habitaciones)",
                buscarValorFormulario(form, "formdata_viviendatotalhabitaciones", "habitaciones", "espaciohabitaciones"),
                "Puntajes (Reg/Tipo/Espacio)",
                construirResumenPuntajesVivienda(form),
                regular
            );
            escribirLineaSimple(
                "Caracteristicas de la vivienda",
                construirDescripcionVivienda(form),
                regular
            );

            escribirSubtituloSimple("MATERIAL DE CONSTRUCCION", bold);
            escribirTabla(
                new String[] {"PISO", "Puntaje"},
                5,
                new float[] {220f, 70f},
                14f,
                bold,
                regular,
                construirFilasEscalaMaterial(
                    new String[] {"Tierra", "Concreto", "Mosaico", "Vitropiso", "Otros"},
                    buscarValorFormulario(form, "formdata_viviendamaterialpiso", "materialpiso"),
                    buscarValorFormulario(form, "formdata_viviendamaterialpisonumero", "materialpisonumero")
                )
            );
            escribirTabla(
                new String[] {"MUROS", "Puntaje"},
                3,
                new float[] {220f, 70f},
                14f,
                bold,
                regular,
                construirFilasEscalaMaterial(
                    new String[] {"Adobe/Tabique", "Concreto", "Otros"},
                    buscarValorFormulario(form, "formdata_viviendamaterialmuros", "materialmuros"),
                    buscarValorFormulario(form, "formdata_viviendamaterialmurosnumero", "materialmurosnumero")
                )
            );
            escribirTabla(
                new String[] {"TECHO", "Puntaje"},
                3,
                new float[] {220f, 70f},
                14f,
                bold,
                regular,
                construirFilasEscalaMaterial(
                    new String[] {"Lamina carton/asbesto", "Concreto", "Otros"},
                    buscarValorFormulario(form, "formdata_viviendamaterialtecho", "materialtecho"),
                    buscarValorFormulario(form, "formdata_viviendamaterialtechonumero", "materialtechonumero")
                )
            );
            cursorY -= SECTION_SPACING;
        }

        private void escribirBloqueAlimentacion(Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            escribirTituloSeccion("V. ALIMENTACION", bold);
            List<String[]> filasAlimentacion = construirFilasAlimentacionDesdeFrecuencia(form, 10);
            escribirTabla(
                new String[] {"Tipo de alimento", "Diario", "C/ tercer dia", "1 vez semana", "1 vez mes", "Ocasional"},
                10,
                new float[] {120f, 60f, 85f, 85f, 70f, 90f},
                14f,
                bold,
                regular,
                filasAlimentacion
            );
            escribirLineaSimple("Observacion de alimentacion", buscarValorFormulario(form, "formdata_alimentacionobservacion", "alimentacionobservacion"), regular);

            escribirSubtituloSimple("V. REFERENCIAS PERSONALES", bold);
            List<String[]> filasReferencias = extraerFilasReferenciasDesdeRaw(form, 3);
            if (filasReferencias.isEmpty()) {
                filasReferencias = extraerFilasIndexadas(
                    form,
                    new String[] {"referencia", "referenciaspersonales", "familyreferences"},
                    new String[] {"nombre", "telefono", "relacion", "tiempoconocer", "tiempo"},
                    3
                );
            }
            escribirTabla(
                new String[] {"Nombre", "Telefono", "Relacion", "Tiempo de conocerse"},
                3,
                new float[] {200f, 90f, 80f, 160f},
                16f,
                bold,
                regular,
                filasReferencias
            );
            cursorY -= SECTION_SPACING;
        }

        private void escribirBloqueDiagnostico(Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            escribirTituloSeccion("VI. DIAGNOSTICO", bold);
            escribirCajaTexto(
                valorDisponible(
                    buscarValorFormulario(form, "formdata_familiarDiagnostico", "familiardiagnostico", "diagnosticovisual"),
                    ""
                ),
                120f,
                regular
            );
            cursorY -= SECTION_SPACING;
        }

        private void escribirBloqueObservaciones(Map<String, String> form, PDFont bold, PDFont regular) throws IOException {
            escribirTituloSeccion("VII. OBSERVACIONES DEL TRABAJADOR SOCIAL", bold);
            escribirCajaTexto(buscarValorFormulario(form, "observacionestrabajadorsocial", "observaciones"), 180f, regular);
            cursorY -= 8;

            escribirTituloSeccion("VIII. OBSERVACIONES DE LA VISITA DOMICILIARIA", bold);
            escribirCajaTexto(buscarValorFormulario(form, "observacionesvisitadomiciliaria", "visitadomiciliaria"), 140f, regular);
            cursorY -= SECTION_SPACING;
        }

        private void escribirNotaYFirmas(PDFont bold, PDFont regular) throws IOException {
            asegurarEspacio(110f);
            escribirTextoAjustado(
                "NOTA: El proporcionar informacion falsa es motivo suficiente para anular el tramite, Marakame se reserva el derecho de investigar la veracidad de lo antes declarado.",
                bold,
                10,
                LEFT_MARGIN,
                CONTENT_WIDTH
            );

            cursorY -= 28;
            float lineY = cursorY;
            float leftLineStart = LEFT_MARGIN;
            float leftLineEnd = LEFT_MARGIN + 185f;
            float rightLineStart = CONTENT_RIGHT - 185f;
            float rightLineEnd = CONTENT_RIGHT;

            dibujarLinea(leftLineStart, lineY, leftLineEnd);
            dibujarLinea(rightLineStart, lineY, rightLineEnd);

            cursorY -= 15;
            escribirTexto("Nombre y Firma del Solicitante", regular, 10, LEFT_MARGIN, cursorY);
            escribirTexto("Nombre y firma del Trabajador Social", regular, 10, rightLineStart, cursorY);
            cursorY -= 12;
        }

        private void escribirTituloSeccion(String titulo, PDFont bold) throws IOException {
            asegurarEspacio(22f);
            escribirTexto(titulo, bold, 12, LEFT_MARGIN, cursorY);
            cursorY -= 12;
        }

        private void escribirSubtituloSimple(String titulo, PDFont font) throws IOException {
            asegurarEspacio(16f);
            escribirTexto(titulo, font, 10, LEFT_MARGIN, cursorY);
            cursorY -= 12;
        }

        private void escribirLineaSimple(String etiqueta, String valor, PDFont regular) throws IOException {
            asegurarEspacio(16f);
            float y = cursorY;
            String label = etiqueta + ":";
            escribirTexto(label, regular, 10, LEFT_MARGIN, y);
            float labelWidth = anchoTexto(label, regular, 10);
            float lineStart = LEFT_MARGIN + labelWidth + 5;
            dibujarLinea(lineStart, y - 2, CONTENT_RIGHT);
            if (valor != null && !valor.isBlank()) {
                escribirTextoRecortado(valor, regular, 9, lineStart + 2, y + 1, CONTENT_RIGHT - lineStart - 4);
            }
            cursorY -= 15;
        }

        private void escribirLineaDoble(String etiqueta1, String valor1, String etiqueta2, String valor2, PDFont regular) throws IOException {
            asegurarEspacio(16f);
            float y = cursorY;

            String leftLabel = etiqueta1 + ":";
            escribirTexto(leftLabel, regular, 10, LEFT_MARGIN, y);
            float leftLabelW = anchoTexto(leftLabel, regular, 10);
            float leftLineStart = LEFT_MARGIN + leftLabelW + 5;
            float leftLineEnd = MIDDLE_X - 10;
            dibujarLinea(leftLineStart, y - 2, leftLineEnd);
            if (valor1 != null && !valor1.isBlank()) {
                escribirTextoRecortado(valor1, regular, 9, leftLineStart + 2, y + 1, leftLineEnd - leftLineStart - 4);
            }

            String rightLabel = etiqueta2 + ":";
            float rightLabelX = MIDDLE_X + 4;
            escribirTexto(rightLabel, regular, 10, rightLabelX, y);
            float rightLabelW = anchoTexto(rightLabel, regular, 10);
            float rightLineStart = rightLabelX + rightLabelW + 5;
            float rightLineEnd = CONTENT_RIGHT;
            dibujarLinea(rightLineStart, y - 2, rightLineEnd);
            if (valor2 != null && !valor2.isBlank()) {
                escribirTextoRecortado(valor2, regular, 9, rightLineStart + 2, y + 1, rightLineEnd - rightLineStart - 4);
            }

            cursorY -= 15;
        }

        private void escribirLineaTriple(
            String etiqueta1,
            String valor1,
            String etiqueta2,
            String valor2,
            String etiqueta3,
            String valor3,
            PDFont regular
        ) throws IOException {
            asegurarEspacio(16f);
            float y = cursorY;
            float colW = CONTENT_WIDTH / 3f;

            escribirLineaEnColumna(LEFT_MARGIN, colW, y, etiqueta1, valor1, regular);
            escribirLineaEnColumna(LEFT_MARGIN + colW, colW, y, etiqueta2, valor2, regular);
            escribirLineaEnColumna(LEFT_MARGIN + (2f * colW), colW, y, etiqueta3, valor3, regular);
            cursorY -= 15;
        }

        private void escribirLineaEnColumna(float x, float width, float y, String etiqueta, String valor, PDFont regular) throws IOException {
            String label = etiqueta + ":";
            escribirTexto(label, regular, 10, x, y);
            float labelW = anchoTexto(label, regular, 10);
            float lineStart = x + labelW + 4;
            float lineEnd = x + width - 4;
            dibujarLinea(lineStart, y - 2, lineEnd);
            if (valor != null && !valor.isBlank()) {
                escribirTextoRecortado(valor, regular, 9, lineStart + 2, y + 1, lineEnd - lineStart - 3);
            }
        }

        private void escribirTabla(
            String[] headers,
            int bodyRows,
            float[] colWidths,
            float rowHeight,
            PDFont bold,
            PDFont regular,
            List<String[]> rowsData
        ) throws IOException {
            float totalW = 0f;
            for (float w : colWidths) {
                totalW += w;
            }

            float totalH = (bodyRows + 1) * rowHeight;
            asegurarEspacio(totalH + 8);
            float topY = cursorY;

            dibujarCaja(LEFT_MARGIN, topY - totalH, totalW, totalH);
            float x = LEFT_MARGIN;
            for (int i = 0; i < colWidths.length - 1; i++) {
                x += colWidths[i];
                dibujarLineaVertical(x, topY, topY - totalH);
            }

            for (int row = 1; row <= bodyRows; row++) {
                float y = topY - (row * rowHeight);
                dibujarLinea(LEFT_MARGIN, y, LEFT_MARGIN + totalW);
            }

            float cursorX = LEFT_MARGIN;
            for (int i = 0; i < headers.length && i < colWidths.length; i++) {
                escribirTextoRecortado(headers[i], bold, 9, cursorX + 3, topY - 11, colWidths[i] - 6);
                cursorX += colWidths[i];
            }

            if (rowsData != null && !rowsData.isEmpty()) {
                for (int row = 0; row < bodyRows && row < rowsData.size(); row++) {
                    String[] cells = rowsData.get(row);
                    float textY = topY - ((row + 1) * rowHeight) - (rowHeight * 0.68f);
                    float colStart = LEFT_MARGIN;

                    for (int col = 0; col < colWidths.length; col++) {
                        String cell = col < cells.length ? cells[col] : "";
                        if (cell != null && !cell.isBlank()) {
                            escribirTextoRecortado(cell, regular, 8.5f, colStart + 3, textY, colWidths[col] - 6);
                        }
                        colStart += colWidths[col];
                    }
                }
            }

            cursorY = topY - totalH - 8;
        }

        private List<String[]> extraerFilasFamiliaDesdeRaw(Map<?, ?> estudioRaw, int maxFilas) {
            List<String[]> filas = new ArrayList<>();
            if (estudioRaw == null || estudioRaw.isEmpty()) {
                return filas;
            }

            Object membersObj = estudioRaw.get("householdMembers");
            if (!(membersObj instanceof Iterable<?> iterable)) {
                return filas;
            }

            for (Object item : iterable) {
                if (!(item instanceof Map<?, ?> filaMap) || filas.size() >= maxFilas) {
                    continue;
                }

                String[] fila = new String[6];
                fila[0] = valorMapa(filaMap, "nombre");
                fila[1] = valorMapa(filaMap, "parentesco");
                fila[2] = valorMapa(filaMap, "edad");
                fila[3] = valorMapa(filaMap, "sexo");
                fila[4] = valorMapa(filaMap, "estadoCivil", "estadocivil");
                fila[5] = valorMapa(filaMap, "ocupacionLugar", "ocupacionlugar", "ocupacion");

                if (tieneContenido(fila)) {
                    filas.add(fila);
                }
            }

            return filas;
        }

        private String valorMapa(Map<?, ?> mapa, String... keys) {
            for (String key : keys) {
                Object value = mapa.get(key);
                if (value != null) {
                    String text = limpiarTextoPdf(String.valueOf(value));
                    if (!text.isBlank()) {
                        return text;
                    }
                }
            }
            return "";
        }

        private boolean tieneContenido(String[] fila) {
            for (String cell : fila) {
                if (cell != null && !cell.isBlank()) {
                    return true;
                }
            }
            return false;
        }

        private List<String[]> extraerFilasVehiculos(Map<String, String> form) {
            List<String[]> filas = new ArrayList<>();
            for (int i = 1; i <= 5; i++) {
                String marca       = buscarValorFormulario(form, "vehicleAssets_" + i + "_marca");
                String ano         = buscarValorFormulario(form, "vehicleAssets_" + i + "_ano");
                String propietario = buscarValorFormulario(form, "vehicleAssets_" + i + "_propietario");
                String[] fila = new String[]{marca, ano, propietario};
                if (tieneContenido(fila)) {
                    filas.add(fila);
                }
            }
            return filas;
        }

        private List<String[]> extraerFilasContribuidores(Map<String, String> form) {
            List<String[]> filas = new ArrayList<>();
            for (int i = 1; i <= 5; i++) {
                String parentesco = buscarValorFormulario(form, "incomeContributors_" + i + "_parentesco");
                String cantidad   = buscarValorFormulario(form, "incomeContributors_" + i + "_cantidadMensual");
                String[] fila = new String[]{parentesco, cantidad};
                if (tieneContenido(fila)) {
                    filas.add(fila);
                }
            }
            return filas;
        }

        private List<String[]> extraerFilasIndexadas(
            Map<String, String> form,
            String[] temaTokens,
            String[] columnas,
            int maxFilas
        ) {
            Map<Integer, String[]> filas = new TreeMap<>();

            for (Map.Entry<String, String> entry : form.entrySet()) {
                String valor = limpiarTextoPdf(entry.getValue());
                if (valor.isBlank()) {
                    continue;
                }

                String keyNorm = normalizarClave(entry.getKey());
                if (!contieneAlgunToken(keyNorm, temaTokens)) {
                    continue;
                }

                Integer indice = extraerPrimerIndice(entry.getKey());
                if (indice == null || indice < 1) {
                    indice = 1;
                }

                String[] row = filas.computeIfAbsent(indice, k -> new String[columnas.length]);
                for (int i = 0; i < columnas.length; i++) {
                    if (keyNorm.contains(normalizarClave(columnas[i])) && (row[i] == null || row[i].isBlank())) {
                        row[i] = valor;
                    }
                }
            }

            List<String[]> salida = new ArrayList<>();
            for (String[] row : filas.values()) {
                if (salida.size() >= maxFilas) {
                    break;
                }

                boolean any = false;
                for (String cell : row) {
                    if (cell != null && !cell.isBlank()) {
                        any = true;
                        break;
                    }
                }
                if (any) {
                    salida.add(row);
                }
            }

            return salida;
        }

        private List<String[]> construirFilasAlimentacionDesdeFrecuencia(Map<String, String> form, int maxFilas) {
            List<String[]> filas = new ArrayList<>();
            String[][] alimentos = new String[][] {
                {"Carne de res", "carneres"},
                {"Carne de pollo", "carnepollo"},
                {"Carne de cerdo", "carnecerdo"},
                {"Pescado", "pescado"},
                {"Leche", "leche"},
                {"Cereales", "cereales"},
                {"Huevo", "huevo"},
                {"Frutas", "frutas"},
                {"Verduras", "verduras"},
                {"Leguminosas", "leguminosas"}
            };

            for (String[] alimento : alimentos) {
                if (filas.size() >= maxFilas) {
                    break;
                }

                String valor = buscarValorFormulario(
                    form,
                    "formdata_foodfrequency_" + alimento[1],
                    "foodfrequency_" + alimento[1]
                );
                if (valor == null || valor.isBlank()) {
                    continue;
                }

                String[] row = new String[6];
                row[0] = alimento[0];
                String valorNorm = normalizarClave(valor);

                if (valorNorm.contains("diario")) {
                    row[1] = "X";
                } else if (valorNorm.contains("tercer") || valorNorm.contains("cada_tercer_dia") || valorNorm.contains("c3")) {
                    row[2] = "X";
                } else if (valorNorm.contains("seman")) {
                    row[3] = "X";
                } else if (valorNorm.contains("mens")) {
                    row[4] = "X";
                } else {
                    row[5] = valor;
                }

                filas.add(row);
            }

            return filas;
        }

        private List<String[]> extraerFilasReferenciasDesdeRaw(Map<String, String> form, int maxFilas) {
            List<String[]> filas = new ArrayList<>();
            for (int i = 0; i < maxFilas; i++) {
                String nombre = buscarValorFormulario(form, "estudio_familyreferences_" + (i + 1) + "_nombre", "estudio_familyreferences_" + i + "_nombre");
                String telefono = buscarValorFormulario(form, "estudio_familyreferences_" + (i + 1) + "_telefono", "estudio_familyreferences_" + i + "_telefono");
                String relacion = buscarValorFormulario(form, "estudio_familyreferences_" + (i + 1) + "_relacion", "estudio_familyreferences_" + i + "_relacion");
                String tiempo = buscarValorFormulario(form, "estudio_familyreferences_" + (i + 1) + "_tiempoconocer", "estudio_familyreferences_" + i + "_tiempoconocer");

                String[] fila = new String[] {nombre, telefono, relacion, tiempo};
                if (tieneContenido(fila)) {
                    filas.add(fila);
                }
            }
            return filas;
        }

        private String construirDescripcionVivienda(Map<String, String> form) {
            String conformacion = buscarValorFormulario(form, "formdata_viviendaconformacion", "viviendaconformacion");
            String banos = buscarValorFormulario(form, "formdata_viviendabanos", "viviendabanos");
            String recamaras = buscarValorFormulario(form, "formdata_viviendarecamaras", "viviendarecamaras");
            String otras = buscarValorFormulario(form, "formdata_viviendaotrascaracteristicas", "viviendaotrascaracteristicas");

            List<String> partes = new ArrayList<>();
            if (!conformacion.isBlank()) {
                partes.add("Conformacion: " + conformacion);
            }
            if (!banos.isBlank()) {
                partes.add("Banos: " + banos);
            }
            if (!recamaras.isBlank()) {
                partes.add("Recamaras: " + recamaras);
            }
            if (!otras.isBlank()) {
                partes.add("Otras: " + otras);
            }
            return String.join(" | ", partes);
        }

        private String construirResumenPuntajesVivienda(Map<String, String> form) {
            String regimen = buscarValorFormulario(form, "formdata_viviendaregimennumero", "viviendaregimennumero");
            String tipo = buscarValorFormulario(form, "formdata_viviendatiponumero", "viviendatiponumero");
            String espacio = buscarValorFormulario(form, "formdata_viviendatotalhabitacionesnumero", "viviendatotalhabitacionesnumero");
            return String.format("%s / %s / %s", valorDisponible(regimen, "-"), valorDisponible(tipo, "-"), valorDisponible(espacio, "-"));
        }

        private List<String[]> construirFilasEscalaMaterial(String[] opciones, String seleccionado, String puntaje) {
            List<String[]> filas = new ArrayList<>();
            String seleccionadoNorm = normalizarClave(seleccionado);

            for (String opcion : opciones) {
                String[] fila = new String[2];
                fila[0] = opcion;
                String opcionNorm = normalizarClave(opcion);
                if (!seleccionadoNorm.isBlank() && (opcionNorm.contains(seleccionadoNorm) || seleccionadoNorm.contains(opcionNorm))) {
                    fila[1] = valorDisponible(puntaje, "X");
                }
                filas.add(fila);
            }

            return filas;
        }

        private boolean contieneAlgunToken(String textoNormalizado, String[] tokens) {
            for (String token : tokens) {
                if (textoNormalizado.contains(normalizarClave(token))) {
                    return true;
                }
            }
            return false;
        }

        private Integer extraerPrimerIndice(String text) {
            Matcher matcher = Pattern.compile("(\\d+)").matcher(text == null ? "" : text);
            if (!matcher.find()) {
                return null;
            }
            try {
                return Integer.valueOf(matcher.group(1));
            } catch (NumberFormatException ex) {
                return null;
            }
        }

        private void escribirCajaTexto(String texto, float altura, PDFont regular) throws IOException {
            asegurarEspacio(altura + 8);
            float topY = cursorY;
            dibujarCaja(LEFT_MARGIN + 10, topY - altura, CONTENT_WIDTH - 20, altura);

            float textY = topY - 14;
            for (String line : envolverTexto(texto == null ? "" : texto, regular, 10, CONTENT_WIDTH - 34)) {
                if (textY < topY - altura + 12) {
                    break;
                }
                escribirTexto(line, regular, 10, LEFT_MARGIN + 17, textY);
                textY -= 12;
            }

            cursorY = topY - altura - 8;
        }

        private void dibujarCaja(float x, float y, float w, float h) throws IOException {
            contentStream.addRect(x, y, w, h);
            contentStream.stroke();
        }

        private void dibujarLineaVertical(float x, float yTop, float yBottom) throws IOException {
            contentStream.moveTo(x, yTop);
            contentStream.lineTo(x, yBottom);
            contentStream.stroke();
        }

        private void dibujarLinea(float x1, float y, float x2) throws IOException {
            contentStream.moveTo(x1, y);
            contentStream.lineTo(x2, y);
            contentStream.stroke();
        }

        private void escribirTexto(String text, PDFont font, float size, float x, float y) throws IOException {
            contentStream.beginText();
            contentStream.setFont(font, size);
            contentStream.newLineAtOffset(x, y);
            contentStream.showText(limpiarTextoPdf(text));
            contentStream.endText();
        }

        private void escribirTextoAlineadoDerecha(String text, PDFont font, float size, float rightX, float y) throws IOException {
            float width = anchoTexto(text, font, size);
            escribirTexto(text, font, size, rightX - width, y);
        }

        private void escribirTextoCentrado(String text, PDFont font, float size, float y) throws IOException {
            float width = anchoTexto(text, font, size);
            float x = LEFT_MARGIN + ((CONTENT_WIDTH - width) / 2f);
            escribirTexto(text, font, size, x, y);
        }

        private void escribirTextoRecortado(String text, PDFont font, float size, float x, float y, float maxWidth) throws IOException {
            String limpio = limpiarTextoPdf(text);
            if (limpio.isBlank()) {
                return;
            }

            StringBuilder resultado = new StringBuilder();
            for (int i = 0; i < limpio.length(); i++) {
                String siguiente = resultado + String.valueOf(limpio.charAt(i));
                if (anchoTexto(siguiente, font, size) > maxWidth) {
                    break;
                }
                resultado.append(limpio.charAt(i));
            }

            escribirTexto(resultado.toString(), font, size, x, y);
        }

        private float anchoTexto(String text, PDFont font, float size) throws IOException {
            return (font.getStringWidth(limpiarTextoPdf(text)) / 1000f) * size;
        }

        private void escribirTextoAjustado(String text, PDFont font, float size, float x, float width) throws IOException {
            for (String line : envolverTexto(text, font, size, width)) {
                asegurarEspacio(LINE_STEP + 2);
                escribirTexto(line, font, size, x, cursorY);
                cursorY -= LINE_STEP;
            }
        }

        private List<String> envolverTexto(String text, PDFont font, float size, float maxWidth) throws IOException {
            List<String> lines = new ArrayList<>();
            String contenido = limpiarTextoPdf(text);
            if (contenido.isBlank()) {
                lines.add("");
                return lines;
            }

            String[] words = contenido.split("\\s+");
            StringBuilder current = new StringBuilder();

            for (String word : words) {
                String candidate = current.isEmpty() ? word : current + " " + word;
                float width = (font.getStringWidth(candidate) / 1000f) * size;
                if (width <= maxWidth || current.isEmpty()) {
                    current = new StringBuilder(candidate);
                } else {
                    lines.add(current.toString());
                    current = new StringBuilder(word);
                }
            }

            if (!current.isEmpty()) {
                lines.add(current.toString());
            }

            return lines;
        }

        private String construirFolio(Paciente paciente) {
            String id = paciente.getId() == null ? "SIN-ID" : String.valueOf(paciente.getId());
            return "MK-ES-" + id + "-" + System.currentTimeMillis();
        }

        private void cerrarFlujoActual() throws IOException {
            if (contentStream != null) {
                contentStream.close();
                contentStream = null;
            }
        }

        @Override
        public void close() throws IOException {
            cerrarFlujoActual();
        }
    }

    public List<Paciente> obtenerPacientesActivos() {
        return pacienteRepository.findAll();
    }

    public Paciente obtenerPacienteById(Long id) {
        return pacienteRepository.findById(id).orElse(null);
    }

    public List<Paciente> obtenerTodosPacientes() {
        return pacienteRepository.findAll();
    }

    // ========== NUEVOS MÉTODOS PARA GESTIÓN DE ESTADO Y PAGOS ==========

    public Optional<Paciente> obtenerPacientePorId(Long id) {
        return pacienteRepository.findById(id);
    }

    public List<Paciente> obtenerPacientesPendientesValidacionPago() {
        return pacienteRepository.findByPagoValidadoFalse();
    }

    @Transactional
    public Paciente validarPagoPaciente(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        ReciboPago recibo = obtenerUltimoReciboPaciente(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("No existe un recibo registrado para este paciente"));

        LocalDateTime ahora = LocalDateTime.now();
        String folio = recibo.getNumeroRecibo();
        if (folio == null || folio.isBlank()) {
            folio = recibo.getTokenGenerado();
        }

        paciente.setPagoValidado(true);
        paciente.setFechaValidacion(ahora);
        paciente.setFolioRecibo(folio);
        pacienteRepository.save(paciente);

        recibo.setEstadoPago("VALIDADO");
        recibo.setFechaValidacion(ahora);
        if (folio != null && !folio.isBlank()) {
            recibo.setNumeroRecibo(folio);
            recibo.setTokenGenerado(folio);
        }
        reciboPagoRepository.save(recibo);

        return paciente;
    }

    @Transactional
    public String validarIngresoYGenerarClave(Long pacienteId, Map<String, Object> payload) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        if (!Boolean.TRUE.equals(paciente.getPagoValidado())) {
            throw new IllegalArgumentException("Esperando validación de Finanzas");
        }

        // Validar que el recibo esté cargado
        String reciboPagadoStr = String.valueOf(payload.getOrDefault("reciboPagado", false));
        boolean reciboPagado = Boolean.parseBoolean(reciboPagadoStr);

        if (!reciboPagado) {
            throw new IllegalArgumentException("El recibo debe estar marcado como pagado para generar clave");
        }

        // Generar clave única: INST-AÑO-IDPACIENTE-ALEATORIO
        String año = String.valueOf(LocalDateTime.now().getYear());
        String aleatorio = String.format("%05d", (int)(Math.random() * 100000));
        String clavePaciente = String.format("INST-%s-%d-%s", año, pacienteId, aleatorio);

        // Actualizar estado del paciente
        paciente.setEstadoPaciente(EstadoPaciente.INGRESADO);
        paciente.setClavePaciente(clavePaciente);
        paciente.setFechaIngreso(LocalDateTime.now());
        pacienteRepository.save(paciente);

        return clavePaciente;
    }

    @Transactional
    public Paciente cambiarEstadoPaciente(Long pacienteId, String nuevoEstado) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        try {
            EstadoPaciente estado = EstadoPaciente.valueOf(nuevoEstado.toUpperCase());
            paciente.setEstadoPaciente(estado);

            if (estado == EstadoPaciente.EGRESO) {
                // Aquí puedes agregar lógica adicional para egreso si es necesario
            }

            return pacienteRepository.save(paciente);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + nuevoEstado);
        }
    }

    public List<ReciboPago> obtenerRecibosPorPaciente(Long pacienteId) {
        return reciboPagoRepository.findByPaciente_Id(pacienteId);
    }

    @Transactional
    public ReciboPago registrarReciboPendiente(Long pacienteId, Map<String, Object> payload) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

		if (paciente.getEstadoPaciente() == EstadoPaciente.DENEGADO) {
			throw new IllegalArgumentException("No se pueden registrar recibos para pacientes denegados");
		}

        String numeroRecibo = (String) payload.getOrDefault("numeroRecibo", "REC-" + pacienteId + "-" + System.currentTimeMillis());
        ReciboPago recibo = reciboPagoRepository.findByNumeroRecibo(numeroRecibo).orElseGet(ReciboPago::new);
        boolean reciboValidado = "VALIDADO".equalsIgnoreCase(String.valueOf(recibo.getEstadoPago()));

        recibo.setPaciente(paciente);
        recibo.setNumeroRecibo(numeroRecibo);
        recibo.setMontoPago(toDoubleValue(payload.getOrDefault("montoPago", recibo.getMontoPago() != null ? recibo.getMontoPago() : 0), 0));
        recibo.setMontoPrograma(toDoubleValue(payload.getOrDefault("montoPrograma", recibo.getMontoPrograma() != null ? recibo.getMontoPrograma() : 0), 0));
        recibo.setConcepto((String) payload.getOrDefault("concepto", recibo.getConcepto() != null ? recibo.getConcepto() : "Tratamiento de desintoxicación"));
        recibo.setNombrePagador((String) payload.getOrDefault("nombrePagador", recibo.getNombrePagador() != null ? recibo.getNombrePagador() : ""));
        recibo.setRfcPagador((String) payload.getOrDefault("rfc", recibo.getRfcPagador() != null ? recibo.getRfcPagador() : ""));

        if (payload.containsKey("archivoReciboUrl") && payload.get("archivoReciboUrl") != null) {
            recibo.setArchivoReciboUrl(String.valueOf(payload.get("archivoReciboUrl")));
        }

        if (recibo.getFechaPago() == null) {
            recibo.setFechaPago(LocalDateTime.now());
        }

        if (!reciboValidado) {
            recibo.setEstadoPago("PENDIENTE");
            paciente.setPagoValidado(false);
            paciente.setFechaValidacion(null);
        }

        paciente.setFolioRecibo(numeroRecibo);
        pacienteRepository.save(paciente);
        return reciboPagoRepository.save(recibo);
    }

    private double toDoubleValue(Object value, double defaultValue) {
        if (value == null) {
            return defaultValue;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        String text = String.valueOf(value).trim();
        if (text.isEmpty()) {
            return defaultValue;
        }
        try {
            return Double.parseDouble(text);
        } catch (NumberFormatException ex) {
            return defaultValue;
        }
    }

    private Optional<ReciboPago> obtenerUltimoReciboPaciente(Long pacienteId) {
        return reciboPagoRepository.findByPaciente_Id(pacienteId).stream()
            .max(Comparator.comparing(ReciboPago::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())));
    }

    @Transactional
    public void eliminarReciboDePaciente(Long pacienteId, Long reciboId) {
        ReciboPago recibo = reciboPagoRepository.findByIdAndPaciente_Id(reciboId, pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Recibo no encontrado para este paciente"));
        reciboPagoRepository.delete(recibo);
    }

    @Transactional
    public Paciente iniciarPagoPaciente(Long pacienteId, String folioRecibo) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));

        paciente.setPagoValidado(false);
        paciente.setFolioRecibo(folioRecibo);
        paciente.setFechaRegistroRecibo(LocalDateTime.now());

        return pacienteRepository.save(paciente);
    }
}