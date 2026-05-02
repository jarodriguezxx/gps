package com.marakame.api.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.dto.UsuarioDTO;
import com.marakame.api.entity.Personal;
import com.marakame.api.entity.Usuario;
import com.marakame.api.repository.PersonalRepository;
import com.marakame.api.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PersonalRepository personalRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody UsuarioDTO dto) {
        Personal personal = personalRepository.findById(dto.personalId()).orElse(null);
        if (personal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Empleado no encontrado."));
        }

        if (usuarioRepository.existsByUsername(dto.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "El nombre de usuario '" + dto.username() + "' ya está en uso."));
        }

        Usuario u = new Usuario();
        u.setPersonal(personal);
        u.setUsername(dto.username().trim().toLowerCase());
        u.setPassword(encoder.encode(dto.password()));
        u.setRol(dto.rol());
        u.setActivo(true);
        u.setFechaCreacion(LocalDateTime.now().toString());

        Usuario guardado = usuarioRepository.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "mensaje",  "Usuario creado correctamente.",
            "id",       guardado.getId(),
            "username", guardado.getUsername()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> actualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> campos) {

        Usuario u = usuarioRepository.findById(id).orElse(null);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Usuario no encontrado."));
        }

        if (campos.containsKey("rol"))    u.setRol((String) campos.get("rol"));
        if (campos.containsKey("activo")) u.setActivo(Boolean.TRUE.equals(campos.get("activo")));
        if (campos.containsKey("password")) {
            String np = (String) campos.get("password");
            if (np != null && !np.isBlank()) u.setPassword(encoder.encode(np));
        }

        usuarioRepository.save(u);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario actualizado."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Usuario no encontrado."));
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado."));
    }
}
