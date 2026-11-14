package com.huellitas.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRegistroDTO(
        @NotBlank @Size(max = 100) String nombres,
        @NotBlank @Size(max = 100) String apellidos,
        @NotBlank @Email @Size(max = 150) String correo,
        @NotBlank @Size(min = 8) String contrasena,
        @Size(max = 20) String telefono,
        @Size(max = 255) String direccion
) {
}