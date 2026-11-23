package com.huellitas.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Representa un evento registrado en el historial de una mascota.
@Entity
@Table(name = "registros_seguimiento")
public class RegistroSeguimiento {

    // Identificador único del registro.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_registro")
    private Long idRegistro;

    // Expediente al que pertenece el registro.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_expediente", nullable = false)
    private Expediente expediente;

    // Usuario responsable del registro.
    // Por ahora se almacena únicamente su identificador.
    @Column(name = "id_usuario_registro", nullable = false)
    private Long idUsuarioRegistro;

    // Categoría del evento: vacuna, consulta, etc.
    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    // Nombre del evento.
    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    // Fecha en que ocurrió el evento.
    @Column(name = "fecha_evento", nullable = false)
    private LocalDate fechaEvento;

    // Descripción u observaciones del evento.
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    // Peso registrado, cuando corresponda.
    @Column(name = "peso_kg", precision = 5, scale = 2)
    private BigDecimal pesoKg;

    // Veterinario responsable, si aplica.
    @Column(name = "veterinario", length = 120)
    private String veterinario;

    // Próxima fecha de revisión o aplicación.
    @Column(name = "proxima_fecha")
    private LocalDate proximaFecha;

    // Fecha de almacenamiento del registro en MySQL.
    @Column(
        name = "fecha_registro",
        nullable = false,
        insertable = false,
        updatable = false
    )
    private LocalDateTime fechaRegistro;

    // Constructor vacío requerido por JPA.
    public RegistroSeguimiento() {
    }

    public Long getIdRegistro() {
        return idRegistro;
    }

    public Expediente getExpediente() {
        return expediente;
    }

    public void setExpediente(Expediente expediente) {
        this.expediente = expediente;
    }

    public Long getIdUsuarioRegistro() {
        return idUsuarioRegistro;
    }

    public void setIdUsuarioRegistro(Long idUsuarioRegistro) {
        this.idUsuarioRegistro = idUsuarioRegistro;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getFechaEvento() {
        return fechaEvento;
    }

    public void setFechaEvento(LocalDate fechaEvento) {
        this.fechaEvento = fechaEvento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPesoKg() {
        return pesoKg;
    }

    public void setPesoKg(BigDecimal pesoKg) {
        this.pesoKg = pesoKg;
    }

    public String getVeterinario() {
        return veterinario;
    }

    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    public LocalDate getProximaFecha() {
        return proximaFecha;
    }

    public void setProximaFecha(LocalDate proximaFecha) {
        this.proximaFecha = proximaFecha;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
}
