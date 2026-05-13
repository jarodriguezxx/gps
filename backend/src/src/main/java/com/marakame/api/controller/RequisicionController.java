package com.marakame.api.controller;

import com.marakame.api.entity.AdjuntoRequisicion;
import com.marakame.api.entity.Requisicion;
import com.marakame.api.entity.ArticuloRequisicion;
import com.marakame.api.entity.Estado;
import com.marakame.api.repository.ArticuloRequisicionRepository;
import com.marakame.api.service.RequisicionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.Normalizer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/requisiciones")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class RequisicionController {

    @Autowired
    private RequisicionService service;

    // Repositorio inyectado para actualizar los artículos
    @Autowired
    private ArticuloRequisicionRepository articuloRepository;

    @GetMapping
    public List<Requisicion> getAll() {
        return service.obtenerTodas();
    }

    @PostMapping
    public Requisicion create(@RequestBody Requisicion requisicion) {
        return service.crear(requisicion);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Requisicion> getById(@PathVariable UUID id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/enviar")
    public ResponseEntity<?> enviar(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.enviar(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/cotizacion")
    public ResponseEntity<?> eliminarCotizacion(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.eliminarCotizacion(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-eliminando-archivo");
        }
    }

    @PostMapping(value = "/{id}/cotizacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirCotizacion(
            @PathVariable UUID id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            return ResponseEntity.ok(service.guardarCotizacion(id, archivo));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-guardando-archivo");
        }
    }

    @GetMapping("/{id}/cotizacion/descargar")
    public ResponseEntity<?> descargarCotizacion(@PathVariable UUID id) {
        try {
            Requisicion req = service.obtenerPorId(id).orElseThrow(NoSuchElementException::new);
            if (req.getCotizacionPath() == null)
                return ResponseEntity.notFound().build();
            java.nio.file.Path path = Paths.get(req.getCotizacionPath());
            if (!Files.exists(path))
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("El archivo fue eliminado y ya no está disponible.");
            byte[] bytes = Files.readAllBytes(path);
            String filename = path.getFileName().toString();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(new ByteArrayResource(bytes));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-leyendo-archivo");
        }
    }

    @GetMapping("/{id}/adjuntos/{adjuntoId}/descargar")
    public ResponseEntity<?> descargarAdjunto(@PathVariable UUID id, @PathVariable UUID adjuntoId) {
        try {
            AdjuntoRequisicion adjunto = service.obtenerAdjunto(id, adjuntoId);
            java.nio.file.Path path = Paths.get(adjunto.getRutaArchivo());
            if (!Files.exists(path))
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("El archivo fue eliminado y ya no está disponible.");
            byte[] bytes = Files.readAllBytes(path);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + adjunto.getNombreOriginal() + "\"")
                    .body(new ByteArrayResource(bytes));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-leyendo-archivo");
        }
    }

    @GetMapping("/{id}/adjuntos")
    public ResponseEntity<?> getAdjuntos(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.listarAdjuntos(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-listando-adjuntos: " + e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/adjuntos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirAdjunto(
            @PathVariable UUID id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            return ResponseEntity.ok(service.guardarAdjunto(id, archivo));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-guardando-archivo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/adjuntos/{adjuntoId}")
    public ResponseEntity<?> eliminarAdjunto(@PathVariable UUID id, @PathVariable UUID adjuntoId) {
        try {
            service.eliminarAdjunto(id, adjuntoId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-eliminando-archivo");
        }
    }

    @PostMapping(value = "/{id}/factura", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirFactura(
            @PathVariable UUID id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            return ResponseEntity.ok(service.guardarFactura(id, archivo));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/factura")
    public ResponseEntity<?> eliminarFactura(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.eliminarFactura(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/adjuntos-factura", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirAdjuntoFactura(
            @PathVariable UUID id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            return ResponseEntity.ok(service.guardarAdjuntoFactura(id, archivo));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @GetMapping("/{id}/adjuntos-factura")
    public ResponseEntity<?> getAdjuntosFactura(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.listarAdjuntosPorTipo(id, "FACTURA"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error-listando-facturas: " + e.getMessage());
        }
    }

    // ==========================================
    // NUEVO MÉTODO: Actualizar artículos entregados
    // ==========================================
    @PutMapping("/articulos/{id}") 
    public ResponseEntity<?> actualizarArticulosEntregados(
            @PathVariable UUID id, 
            @RequestBody Map<String, Integer> request) {
        
        Optional<ArticuloRequisicion> articuloOpt = articuloRepository.findById(id);
        
        if (articuloOpt.isPresent()) {
            ArticuloRequisicion articulo = articuloOpt.get();
            
            Integer entregados = request.containsKey("articulos_entregados") ? 
                                 request.get("articulos_entregados") : 
                                 request.get("articulosEntregados");
                                 
            if (entregados != null) {
                articulo.setArticulosEntregados(entregados);
                articuloRepository.save(articulo);
                return ResponseEntity.ok(articulo);
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/firma-administradora")
    public ResponseEntity<?> firmarAdministradora(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Rol", required = false) String rol) {
        if (!"administracion".equals(rol)) {
            return ResponseEntity.status(403).body("acceso-denegado");
        }
        try {
            return ResponseEntity.ok(service.firmarAdministradora(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/firma-directora-gral")
    public ResponseEntity<?> firmarDirectoraGral(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Rol", required = false) String rol) {
        if (!"direccion-general".equals(rol)) {
            return ResponseEntity.status(403).body("acceso-denegado");
        }
        try {
            return ResponseEntity.ok(service.firmarDirectoraGral(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/validar-admisiones")
    public ResponseEntity<?> validarJefeAdmisiones(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Rol", required = false) String rol) {
        return validarRequisicionDeArea(id, rol, "jefe-admisiones", "Admisiones");
    }

    @PatchMapping("/{id}/validar-medico")
    public ResponseEntity<?> validarJefeMedico(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Rol", required = false) String rol) {
        return validarRequisicionDeArea(id, rol, "jefe-medico", "Médico");
    }

    @PatchMapping("/{id}/validar-clinico")
    public ResponseEntity<?> validarJefeClinico(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Rol", required = false) String rol) {
        return validarRequisicionDeArea(id, rol, "jefe-clinico", "Clínico");
    }

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Rol", required = false) String rol,
            @RequestBody Map<String, String> body) {
        try {
            Requisicion req = service.obtenerPorId(id).orElseThrow(NoSuchElementException::new);
            if (!puedeGestionarArea(rol, req)) {
                return ResponseEntity.status(403).body("acceso-denegado");
            }
            return ResponseEntity.ok(service.rechazar(id, rol, body.get("observaciones")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("error-inesperado: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/tamanio")
    public ResponseEntity<?> actualizarTamanio(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        try {
            if (!body.containsKey("tamanio"))
                return ResponseEntity.badRequest().body("Falta el campo 'tamanio' en la petición.");
            com.marakame.api.entity.TamanioCompra tamanio =
                    com.marakame.api.entity.TamanioCompra.valueOf(body.get("tamanio"));
            return ResponseEntity.ok(service.actualizarTamanio(id, tamanio));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Tamaño no reconocido: " + body.get("tamanio"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    
// ==========================================
    // NUEVO MÉTODO: Actualizar estado general de la Requisición
    // ==========================================
    @PatchMapping("/{id}")
    public ResponseEntity<?> actualizarEstadoRequisicion(
            @PathVariable UUID id, 
            @RequestBody java.util.Map<String, String> body) {
        try {
            if (!body.containsKey("estado")) {
                return ResponseEntity.badRequest().body("Falta el campo 'estado' en la petición.");
            }
            
            // Convertimos el texto (ej. "INCOMPLETA") al valor del Enum
            Estado nuevoEstado = Estado.fromJson(body.get("estado"));
            
            // Llamamos al servicio para guardar
            Requisicion actualizada = service.actualizarEstado(id, nuevoEstado);
            
            return ResponseEntity.ok(actualizada);
            
        } catch (java.util.NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado no reconocido por el sistema: " + body.get("estado"));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    private ResponseEntity<?> validarRequisicionDeArea(UUID id, String rol, String rolEsperado, String areaEsperada) {
        if (!rolEsperado.equals(rol)) {
            return ResponseEntity.status(403).body("acceso-denegado");
        }
        try {
            Requisicion req = service.obtenerPorId(id).orElseThrow(NoSuchElementException::new);
            if (!areaCoincide(req.getArea(), areaEsperada)) {
                return ResponseEntity.status(403).body("area-no-autorizada");
            }
            if (req.getEstado() != Estado.PENDIENTE) {
                return ResponseEntity.badRequest().body("solo-requisiciones-pendientes");
            }
            return ResponseEntity.ok(service.actualizarEstado(id, Estado.PRE_AUTORIZADA));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("error-inesperado: " + e.getMessage());
        }
    }

    private boolean puedeGestionarArea(String rol, Requisicion requisicion) {
        if (rol == null || requisicion == null) return false;
        return switch (rol) {
            case "jefe-admisiones" -> areaCoincide(requisicion.getArea(), "Admisiones");
            case "jefe-medico" -> areaCoincide(requisicion.getArea(), "Médico");
            case "jefe-clinico" -> areaCoincide(requisicion.getArea(), "Clínico");
            default -> false;
        };
    }

    private boolean areaCoincide(String areaReal, String areaEsperada) {
        return normalizar(areaReal).equals(normalizar(areaEsperada));
    }

    private String normalizar(String texto) {
        if (texto == null) return "";
        String sinAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return sinAcentos.trim().toLowerCase();
    }
}
