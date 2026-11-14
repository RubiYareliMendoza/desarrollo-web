package com.huellitas.backend.controller;

import com.huellitas.backend.dto.UsuarioRegistroDTO;
import com.huellitas.backend.dto.UsuarioRespuestaDTO;
import com.huellitas.backend.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioRespuestaDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @PostMapping
    public ResponseEntity<UsuarioRespuestaDTO> registrarUsuario(
            @Valid @RequestBody UsuarioRegistroDTO datos) {
        UsuarioRespuestaDTO usuario =
                usuarioService.registrarUsuario(datos);

        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDTO> buscarUsuarioPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorId(id));
    }
}