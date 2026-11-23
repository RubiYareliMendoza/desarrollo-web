package com.huellitas.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Representa el expediente digital de una mascota.
@Entity
@Table(name = "expedientes")
public class Expediente {

    // Identificador único del expediente.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_expediente")
    private Long idExpediente;

    // Relación: cada expediente pertenece a una mascota.
    // UNIQUE en MySQL impide tener dos expedientes
    // asociados a la misma mascota.
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_mascota", nullable = false, unique = true)
    private Mascota mascota;

    // Fecha de creación del expediente.
    @Column(name = "fecha_creacion", nullable = false,
            insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // Información adicional de la mascota.
    @Column(name = "observaciones_generales", columnDefinition = "TEXT")
    private String observacionesGenerales;

    // Constructor vacío requerido por JPA.
    public Expediente() {
    }

    public Long getIdExpediente() {
        return idExpediente;
    }

    public Mascota getMascota() {
        return mascota;
    }

    public void setMascota(Mascota mascota) {
        this.mascota = mascota;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public String getObservacionesGenerales() {
        return observacionesGenerales;
    }

    public void setObservacionesGenerales(String observacionesGenerales) {
        this.observacionesGenerales = observacionesGenerales;
    }
}
