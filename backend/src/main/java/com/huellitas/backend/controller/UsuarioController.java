package com.huellitas.backend.controller;

import com.huellitas.backend.dto.UsuarioRegistroDTO;
import com.huellitas.backend.dto.UsuarioRespuestaDTO;
import com.huellitas.backend.service.UsuarioService;
import com.huellitas.backend.dto.UsuarioActualizarDTO;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = {"http://localhost:5500","http://127.0.0.1:3000","http://localhost:3000"})
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioRespuestaDTO>> listarUsuarios(
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) String rol) {

        return ResponseEntity.ok(
                usuarioService.listarUsuarios(activo, rol));
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
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDTO> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioActualizarDTO datos) {

        return ResponseEntity.ok(
                usuarioService.actualizarUsuario(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}