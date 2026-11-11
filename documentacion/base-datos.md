# Diseño de la base de datos — Huellitas(el nombre aun esta por decidirse bien jeje)

## Propósito

La base de datos almacenará las cuentas de adoptantes y del administrador del refugio, las mascotas disponibles, las solicitudes de adopción y el expediente digital de cada mascota.

El sistema está destinado a un solo refugio.

## Tecnologías

- Frontend:HTML, CSS y JavaScript.
- Comunicación con el backend: Fetch API mediante peticiones HTTP.
- Intercambio de datos: JSON en las peticiones y respuestas, Query String para enviar parámetros, por ejemplo, filtros de búsqueda.
- Backend: Java con Spring Boot.
- API: servicios REST que utilizarán los métodos GET, POST, PUT y DELETE.
- Base de datos: MySQL.
- Persistencia: Hibernate como ORM.
- Entorno de trabajo: WSL, Git y Visual Studio Code.

## Entidades propuestas

### 1. roles

Define los tipos de usuario del sistema.

| Campo     | Tipo sugerido | Restricciones |
| id_rol    | INT           | Clave primaria |
| nombre_rol| VARCHAR(30)   | Obligatorio y único |

Valores iniciales: `ADOPTANTE` y `ADMINISTRADOR`.

### 2. usuarios

Almacena las cuentas de las personas que utilizan Huellitas.

| Campo      | Tipo sugerido | Restricciones                  |
| id_usuario | INT           | Clave primaria                 |
| id_rol     | INT           | Clave foránea a `roles.id_rol` |
| nombres    | VARCHAR(100)  | Obligatorio                    |
| apellidos  | VARCHAR(100)  | Obligatorio                    |
| correo     | VARCHAR(150)  | Obligatorio y único            |
| contrasena_hash | VARCHAR(255) | Obligatorio                |
| telefono   | VARCHAR(20)   | Opcional                       |
| direccion  | VARCHAR(255)  | Opcional                       |
| activo     | BOOLEAN       | Obligatorio                    |
| fecha_registro | DATETIME | Obligatorio                     |

La contraseña se almacenará como hash, nunca como texto legible. El administrador del refugio tendrá el rol `ADMINISTRADOR`.

### 3. mascotas

Almacena las mascotas registradas y publicadas por el refugio.

| Campo                      | Tipo sugerido | Restricciones  |
| id_mascota                 | INT           | Clave primaria |
| nombre                     | VARCHAR(80)   | Obligatorio    |
| especie                    | VARCHAR(40)   | Obligatorio    |
| raza                       | VARCHAR(80)   | Opcional       |
| sexo                       | VARCHAR(20)   | Obligatorio    |
| fecha_nacimiento_estimada  | DATE          | Opcional       |
| tamano                     | VARCHAR(30)   | Opcional       |
| descripcion                | TEXT          | Opcional       |
| imagen_principal_url       | VARCHAR(500)  | Opcional       |
| estado                     | VARCHAR(30)   | Obligatorio    |
| fecha_registro             | DATETIME      | Obligatorio    |

Estados iniciales: `DISPONIBLE`, `EN_PROCESO`, `ADOPTADA` e `INACTIVA`.

### 4. solicitudes_adopcion

Registra las solicitudes enviadas por los adoptantes y la decisión del administrador.

| Campo         | Tipo sugerido | Restricciones  |
| id_solicitud  | INT           | Clave primaria |
| id_mascota    | INT           | Clave foránea a `mascotas.id_mascota` |
| id_adoptante  | INT           | Clave foránea a `usuarios.id_usuario` |
| id_revisor    | INT           | Clave foránea opcional a `usuarios.id_usuario` |
| fecha_solicitud | DATETIME    | Obligatorio    |
| estado        | VARCHAR(30)   | Obligatorio    |
| mensaje       | TEXT          | Opcional       |
| observaciones_revision | TEXT | Opcional       |

Estados iniciales: `PENDIENTE`, `APROBADA`, `RECHAZADA` y `CANCELADA`. El campo `id_revisor` identifica al administrador que revisó la solicitud.

### 5. adopciones

Registra las adopciones que se concretan a partir de solicitudes aprobadas.

| Campo          | Tipo sugerido | Restricciones    |
| id_adopcion    | INT           | Clave primaria   |
| id_solicitud   | INT           | Clave foránea única a `solicitudes_adopcion.id_solicitud` |
| fecha_adopcion | DATE          | Obligatorio      |
| estado         | VARCHAR(20)   | Obligatorio      |
| observaciones  | TEXT          | Opcional         |

Estados iniciales: `ACTIVA` y `FINALIZADA`. El adoptante y la mascota se identifican a través de la solicitud relacionada.

### 6. expedientes

Mantiene un expediente digital individual por mascota.

| Campo                    | Tipo sugerido  | Restricciones   |

| id_expediente            | INT            | Clave primaria  |
| id_mascota               | INT            | Clave foránea única a `mascotas.id_mascota` |
| fecha_creacion           | DATETIME       | Obligatorio     |
| observaciones_generales  | TEXT           | Opcional        |

La relación única con la mascota permite que cada animal tenga un solo expediente.

### 7. registros_seguimiento

Almacena vacunas, consultas veterinarias, desparasitaciones, tratamientos y registros de peso.

| Campo                | Tipo sugerido | Restricciones |

| id_registro          | INT            | Clave primaria    |
| id_expediente        | INT            | Clave foránea a `expedientes.id_expediente` |
| id_usuario_registro  | INT            | Clave foránea a `usuarios.id_usuario` |
| tipo                 | VARCHAR(30)    | Obligatorio       |
| nombre               | VARCHAR(120)   | Obligatorio       |
| fecha_evento         | DATE           | Obligatorio       |
| descripcion          | TEXT           | Opcional          |
| peso_kg              | DECIMAL(5,2)   | Opcional; se utiliza para registros de peso |
| veterinario          | VARCHAR(120)   | Opcional          |
| proxima_fecha        | DATE           | Opcional          |
| fecha_registro       | DATETIME       | Obligatorio       |

Valores iniciales para `tipo`: `VACUNA`, `CONSULTA`, `DESPARASITACION`, `TRATAMIENTO` y `PESO`.
El expediente descargable se generará con la información de la mascota, su expediente y sus registros de seguimiento. 

## Relaciones principales

- Un rol puede asignarse a muchos usuarios.
- Un adoptante puede enviar muchas solicitudes.
- Una mascota puede recibir muchas solicitudes.
- Un administrador puede revisar muchas solicitudes.
- Una solicitud aprobada puede generar una adopción.
- Cada mascota tiene un expediente.
- Un expediente puede contener muchos registros de seguimiento y documentos.
- Un usuario puede registrar eventos de seguimiento o cargar documentos.

## Reglas de integridad iniciales

- El correo de cada usuario será único.
- Solo el administrador podrá registrar mascotas y revisar solicitudes.
- Solo los usuarios con rol `ADOPTANTE` podrán enviar solicitudes.
- No se creará una adopción si la solicitud relacionada no fue aprobada.
- El adoptante podrá actualizar el seguimiento de una mascota cuando tenga una adopción activa de ella.
- El acceso a la información y las operaciones disponibles dependerán del rol del usuario.
- Las cuentas y mascotas se desactivarán cuando se necesite conservar su historial, en lugar de eliminar sus datos históricos.