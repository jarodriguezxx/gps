package com.marakame.api.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marakame.api.entity.Usuario;
import com.marakame.api.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Usuario y contraseña son requeridos."));
        }

        Usuario usuario = usuarioRepository.findByUsername(username.trim().toLowerCase()).orElse(null);

        if (usuario == null || !usuario.isActivo()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Credenciales incorrectas."));
        }

        if (!encoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Credenciales incorrectas."));
        }

        return ResponseEntity.ok(Map.of(
            "id",             usuario.getId(),
            "username",       usuario.getUsername(),
            "rol",            usuario.getRol() != null ? usuario.getRol() : "",
            "nombreCompleto", usuario.getNombreCompleto() != null ? usuario.getNombreCompleto() : ""
        ));
    }
}
