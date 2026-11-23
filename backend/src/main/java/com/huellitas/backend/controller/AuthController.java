package com.huellitas.backend.controller;

import com.huellitas.backend.dto.LoginDTO;
import com.huellitas.backend.dto.UsuarioRespuestaDTO;
import com.huellitas.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
})
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioRespuestaDTO> iniciarSesion(
            @Valid @RequestBody LoginDTO datos) {

        UsuarioRespuestaDTO usuario = usuarioService.iniciarSesion(
                datos.correo(),
                datos.contrasena());

        return ResponseEntity.ok(usuario);
    }
}