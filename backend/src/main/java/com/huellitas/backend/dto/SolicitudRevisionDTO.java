package com.huellitas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SolicitudRevisionDTO(
        @NotNull Long idRevisor,

        @NotBlank
        @Pattern(regexp = "APROBADA|RECHAZADA")
        String estado,

        @Size(max = 2000)
        String observacionesRevision
) {
}