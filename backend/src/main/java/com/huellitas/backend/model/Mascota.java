package com.huellitas.backend.model;

// Librerías para relacionar la clase con la base de datos
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;

// Indica que esta clase representa una tabla de la base de datos
@Entity
@Table(name = "mascotas")
public class Mascota {

    // Identificador único de cada mascota, generado automáticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota")
    private Long idMascota;

    // Información general de la mascota
    
    // El nombre de la mascota es obligatorio
    @NotBlank(message = "El nombre de la mascota es obligatorio")
    private String nombre;
    // La especie también es obligatoria
    @NotBlank(message = "La especie de la mascota es obligatoria")
    private String especie;
    private String raza;
    private String sexo;

    // Fecha aproximada de nacimiento
    @Column(name = "fecha_nacimiento_estimada")
    private LocalDate fechaNacimientoEstimada;

    // Características físicas y descripción
    private String tamano;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Dirección de la imagen principal de la mascota
    @Column(name = "imagen_principal_url")
    private String imagenPrincipalUrl;

    // Estado de adopción de la mascota
    private String estado;

    // Fecha en la que se registró en el sistema
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    // Constructor vacío requerido por JPA
    public Mascota() {
    }

    // Permite obtener el identificador de la mascota
    public Long getIdMascota() {
        return idMascota;
    }

    // Permite consultar y modificar el nombre
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Permite consultar y modificar la especie
    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    // Permite consultar y modificar la raza
    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    // Permite consultar y modificar el sexo
    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    // Permite consultar y modificar la fecha de nacimiento estimada
    public LocalDate getFechaNacimientoEstimada() {
        return fechaNacimientoEstimada;
    }

    public void setFechaNacimientoEstimada(LocalDate fechaNacimientoEstimada) {
        this.fechaNacimientoEstimada = fechaNacimientoEstimada;
    }

    // Permite consultar y modificar el tamaño
    public String getTamano() {
        return tamano;
    }

    public void setTamano(String tamano) {
        this.tamano = tamano;
    }

    // Permite consultar y modificar la descripción
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Permite consultar y modificar la imagen principal
    public String getImagenPrincipalUrl() {
        return imagenPrincipalUrl;
    }

    public void setImagenPrincipalUrl(String imagenPrincipalUrl) {
        this.imagenPrincipalUrl = imagenPrincipalUrl;
    }

    // Permite consultar y modificar el estado de adopción
    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    // Permite consultar la fecha de registro
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

}
