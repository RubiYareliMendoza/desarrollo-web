package com.huellitas.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SolicitudCrearDTO(
        @NotNull Long idMascota,
        @NotNull Long idAdoptante,
        @Size(max = 2000) String mensaje
) {
}