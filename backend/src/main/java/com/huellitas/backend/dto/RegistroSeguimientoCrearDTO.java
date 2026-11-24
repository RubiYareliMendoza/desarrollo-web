package com.huellitas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

// Datos que recibimos al registrar un evento de seguimiento.
public record RegistroSeguimientoCrearDTO(

    @NotNull
    @Positive
    Long idExpediente,

    @NotNull
    @Positive
    Long idUsuarioRegistro,

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

