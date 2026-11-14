
CREATE DATABASE IF NOT EXISTS huellitas
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE huellitas;

CREATE TABLE IF NOT EXISTS roles (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uk_roles_nombre_rol (nombre_rol)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    id_rol BIGINT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uk_usuarios_correo (correo),
    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mascotas (
    id_mascota BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    especie VARCHAR(80) NOT NULL,
    raza VARCHAR(80),
    sexo VARCHAR(20) NOT NULL,
    fecha_nacimiento_estimada DATE,
    tamano VARCHAR(30),
    descripcion TEXT,
    imagen_principal_url VARCHAR(500),
    estado VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_mascota)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS solicitudes_adopcion (
    id_solicitud BIGINT NOT NULL AUTO_INCREMENT,
    id_mascota BIGINT NOT NULL,
    id_adoptante BIGINT NOT NULL,
    id_revisor BIGINT,
    fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    mensaje TEXT,
    observaciones_revision TEXT,
    PRIMARY KEY (id_solicitud),
    CONSTRAINT fk_solicitudes_mascotas
        FOREIGN KEY (id_mascota) REFERENCES mascotas (id_mascota)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_solicitudes_adoptantes
        FOREIGN KEY (id_adoptante) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_solicitudes_revisores
        FOREIGN KEY (id_revisor) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS adopciones (
    id_adopcion BIGINT NOT NULL AUTO_INCREMENT,
    id_solicitud BIGINT NOT NULL,
    fecha_adopcion DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
    observaciones TEXT,
    PRIMARY KEY (id_adopcion),
    UNIQUE KEY uk_adopciones_solicitud (id_solicitud),
    CONSTRAINT fk_adopciones_solicitudes
        FOREIGN KEY (id_solicitud)
        REFERENCES solicitudes_adopcion (id_solicitud)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expedientes (
    id_expediente BIGINT NOT NULL AUTO_INCREMENT,
    id_mascota BIGINT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones_generales TEXT,
    PRIMARY KEY (id_expediente),
    UNIQUE KEY uk_expedientes_mascota (id_mascota),
    CONSTRAINT fk_expedientes_mascotas
        FOREIGN KEY (id_mascota) REFERENCES mascotas (id_mascota)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS registros_seguimiento (
    id_registro BIGINT NOT NULL AUTO_INCREMENT,
    id_expediente BIGINT NOT NULL,
    id_usuario_registro BIGINT NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    fecha_evento DATE NOT NULL,
    descripcion TEXT,
    peso_kg DECIMAL(5,2),
    veterinario VARCHAR(120),
    proxima_fecha DATE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_registro),
    CONSTRAINT fk_seguimiento_expedientes
        FOREIGN KEY (id_expediente) REFERENCES expedientes (id_expediente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_seguimiento_usuarios
        FOREIGN KEY (id_usuario_registro) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (nombre_rol)
VALUES ('ADOPTANTE'), ('ADMINISTRADOR');