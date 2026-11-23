package com.huellitas.backend.dto;

import java.time.LocalDateTime;

public record SolicitudRespuestaDTO(
        Long idSolicitud,
        Long idMascota,
        String nombreMascota,
        Long idAdoptante,
        String nombreAdoptante,
        String correoAdoptante,
        Long idRevisor,
        String nombreRevisor,
        LocalDateTime fechaSolicitud,
        String estado,
        String mensaje,
        String observacionesRevision
) {
}