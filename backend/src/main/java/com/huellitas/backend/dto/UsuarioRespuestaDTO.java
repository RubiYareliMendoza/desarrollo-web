package com.huellitas.backend.dto;

import java.time.LocalDateTime;

public record UsuarioRespuestaDTO(
        Long idUsuario,
        Long idRol,
        String nombreRol,
        String nombres,
        String apellidos,
        String correo,
        String telefono,
        String direccion,
        Boolean activo,
        LocalDateTime fechaRegistro
) {
}