package com.huellitas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

// Datos permitidos al editar un registro existente.
public record RegistroSeguimientoEditarDTO(

    @NotBlank
    String tipo,

    @NotBlank
    String nombre,

    @NotNull
    LocalDate fechaEvento,

    String descripcion,

    BigDecimal pesoKg,

    String veterinario,

    LocalDate proximaFecha

) {}
