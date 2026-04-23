package com.marakame.api.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import com.marakame.api.dto.PacienteDTO;
import com.marakame.api.entity.EstudioSocioeconomicoPdf;
import com.marakame.api.entity.Paciente;
import com.marakame.api.entity.Seguimiento;
import com.marakame.api.entity.Solicitante;
import com.marakame.api.repository.PacienteRepository;
import com.marakame.api.repository.EstudioSocioeconomicoPdfRepository;
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

    @Autowired
    private EstudioSocioeconomicoPdfRepository estudioSocioeconomicoPdfRepository;

    public List<Paciente> obtenerPacientesParaEstudio(String query) {
        String filtro = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);

        return pacienteRepository.findAll().stream()
            .filter(paciente -> {
                if (filtro.isBlank()) {
                    return true;
                }

                Solicitante solicitante = paciente.getSolicitante();
                return contiene(paciente.getNombreCompleto(), filtro)
                    || contiene(paciente.getTelefonoContacto(), filtro)
                    || contiene(paciente.getOrigen(), filtro)
                    || contiene(paciente.getDomicilioParticular(), filtro)
                    || (solicitante != null
                        && (contiene(solicitante.getNombre(), filtro)
                            || contiene(solicitante.getTelefono(), filtro)
                            || contiene(solicitante.getCelular(), filtro)
                            || contiene(solicitante.getDomicilioParticular(), filtro)));
            })
            .collect(Collectors.toList());
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

        solicitante.setNombre(valorActualizado(solicitante.getNombre(), asString(payload.get("nombreSolicitante"))));
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

        paciente.setNombreCompleto(valorActualizado(paciente.getNombreCompleto(), asString(payload.get("nombrePaciente"))));
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

    @Transactional // Esto asegura que si algo falla, no se guarde nada a medias
    public void guardarNuevoExpediente(PacienteDTO dto) {
        boolean llamadaNosotros = "nosotros".equalsIgnoreCase(dto.llamarPaciente());
        boolean llamadaProspecto = "paciente".equalsIgnoreCase(dto.llamarPaciente()) || "prospecto".equalsIgnoreCase(dto.llamarPaciente());
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
        } else if (llamadaProspecto) {
            estadoSeguimiento = "Llamada solicitada por el prospecto";
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

            try (PdfLayoutState pdf = new PdfLayoutState(document)) {
                pdf.escribirTitulo("Estudio Socioeconomico", bold);
                pdf.escribirLinea("Paciente: " + valorTexto(paciente.getNombreCompleto()), regular, 11);
                pdf.escribirLinea("Generado en: " + LocalDateTime.now(), regular, 11);
                pdf.saltearLinea();

                Object estudio = payload.get("estudio");
                if (estudio instanceof Map<?, ?> estudioMap) {
                    pdf.escribirSeccion("Formulario completo", estudioMap, bold, regular);
                } else {
                    pdf.escribirSeccion("Formulario completo", payload, bold, regular);
                }
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

    private String truncarPdf(String texto) {
        String limpio = limpiarTextoPdf(texto);
        return limpio.length() > 140 ? limpio.substring(0, 137) + "..." : limpio;
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

    private String formatearEtiqueta(String key) {
        if (key == null || key.isBlank()) {
            return "Campo";
        }

        String texto = key.replaceAll("([a-z])([A-Z])", "$1 $2").replace('_', ' ').trim();
        if (texto.isEmpty()) {
            return "Campo";
        }

        return Character.toUpperCase(texto.charAt(0)) + texto.substring(1);
    }

    private final class PdfLayoutState implements AutoCloseable {
        private static final float LEFT_MARGIN = 50f;
        private static final float TOP_MARGIN = 740f;
        private static final float BOTTOM_MARGIN = 55f;
        private static final float LINE_STEP = 14f;

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

        private void escribirTitulo(String titulo, PDFont font) throws IOException {
            asegurarEspacio(28);
            escribirLineaInterna(titulo, font, 18, LEFT_MARGIN);
            cursorY -= 6;
        }

        private void saltearLinea() throws IOException {
            asegurarEspacio(LINE_STEP);
            cursorY -= LINE_STEP;
        }

        private void escribirLinea(String text, PDFont font, float size) throws IOException {
            escribirLineaInterna(text, font, size, LEFT_MARGIN);
        }

        private void escribirSeccion(String titulo, Map<?, ?> seccion, PDFont bold, PDFont regular) throws IOException {
            if (titulo != null && !titulo.isBlank()) {
                asegurarEspacio(24);
                escribirLineaInterna(titulo, bold, 13, LEFT_MARGIN);
                cursorY -= 4;
            }

            for (Map.Entry<?, ?> entry : seccion.entrySet()) {
                escribirCampo(entry.getKey(), entry.getValue(), bold, regular, 0);
            }

            cursorY -= 8;
        }

        private void escribirCampo(Object key, Object value, PDFont bold, PDFont regular, int nivel) throws IOException {
            String label = formatearEtiqueta(String.valueOf(key));
            float indent = LEFT_MARGIN + (nivel * 14f);

            if (value instanceof Map<?, ?> nestedMap) {
                asegurarEspacio(22);
                escribirLineaInterna(label, bold, 11, indent);
                cursorY -= 2;
                escribirSeccion("", nestedMap, bold, regular);
                return;
            }

            if (value instanceof Iterable<?> iterable) {
                asegurarEspacio(20);
                escribirLineaInterna(label, bold, 11, indent);
                int index = 1;
                for (Object item : iterable) {
                    if (item instanceof Map<?, ?> itemMap) {
                        escribirLineaInterna(index + ".", regular, 10, indent + 12);
                        escribirSeccion("", itemMap, bold, regular);
                    } else {
                        escribirLineaInterna(index + ". " + truncarPdf(valorTexto(item)), regular, 10, indent + 12);
                    }
                    index++;
                }
                return;
            }

            escribirLineaInterna(label + ": " + truncarPdf(valorTexto(value)), regular, 10, indent + 10);
        }

        private void escribirLineaInterna(String text, PDFont font, float size, float x) throws IOException {
            asegurarEspacio(LINE_STEP);
            contentStream.beginText();
            contentStream.setFont(font, size);
            contentStream.newLineAtOffset(x, cursorY);
            contentStream.showText(limpiarTextoPdf(text));
            contentStream.endText();
            cursorY -= LINE_STEP;
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
}