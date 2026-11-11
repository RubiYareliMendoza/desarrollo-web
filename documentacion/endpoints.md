# Endpoints REST — Huellitas

## Propósito

Este documento describe las rutas REST iniciales del sistema Huellitas(el nombre se cambiará ya esta decidido pero es que no hemos pensado bien jeje). El frontend utilizará Fetch API para comunicarse con el backend Java/Spring Boot mediante HTTP.

Las peticiones y respuestas intercambiarán datos en JSON. Se podrán usar Query String en las rutas de consulta para enviar filtros.

## Roles

- **ADOPTANTE:** consulta mascotas, envía solicitudes y consulta o actualiza el seguimiento de sus mascotas adoptadas.
- **ADMINISTRADOR:** registra y actualiza mascotas, revisa solicitudes y administra la información del refugio.

## Endpoints

| Método    | Ruta                                          | Descripción                                                                                           | Acceso                            |

| POST      | `/api/auth/login`                             | Inicia sesión con correo y contraseña; devuelve los datos básicos del usuario y su rol.               | Público                           |
| POST      | `/api/usuarios`                               | Registra una cuenta de adoptante. El rol se asigna como `ADOPTANTE`.                                  | Público                           |
| GET       | `/api/usuarios/{id}`                          | Consulta el perfil propio o, si es administrador, el perfil indicado.                                 | Adoptante / Administrador         |
| PUT       | `/api/usuarios/{id}`                          | Actualiza los datos del perfil.                                                                       | Propietario del perfil / Administrador |
| GET       | `/api/mascotas`                               | Consulta el catálogo. Puede filtrar con Query String, por ejemplo: `?estado=DISPONIBLE&especie=perro`. | Público                          |
| GET       | `/api/mascotas/{id}`                          | Consulta el detalle de una mascota.                                                                    | Público                          |
| POST      | `/api/mascotas`                               | Registra una mascota.                                                                                  | Administrador                    |
| PUT       | `/api/mascotas/{id}`                          | Actualiza los datos o el estado de una mascota.                                                        | Administrador                    |
| DELETE    | `/api/mascotas/{id}`                          | Da de baja una mascota, conservando sus solicitudes e historial.                                       | Administrador                    |
| POST      | `/api/solicitudes`                            | Crea una solicitud para adoptar una mascota.                                                           | Adoptante                        |
| GET       | `/api/solicitudes`                            | Consulta solicitudes. El administrador puede filtrar, por ejemplo: `?estado=PENDIENTE`; el adoptante ve las propias.| Adoptante / Administrador |
| GET       | `/api/solicitudes/{id}`                       | Consulta el detalle de una solicitud propia o revisada por el administrador.                           | Adoptante / Administrador        |
| PUT       | `/api/solicitudes/{id}`                       | Actualiza una solicitud pendiente o cambia su estado durante la revisión.                              | Adoptante / Administrador        |
| DELETE    | `/api/solicitudes/{id}`                       | Cancela una solicitud pendiente del adoptante.                                                         | Adoptante                        |
| POST      | `/api/solicitudes/{id}/adopcion`              | Registra la adopción correspondiente a una solicitud aprobada.                                         | Administrador                    |
| GET       | `/api/mascotas/{id}/expediente`               | Consulta el expediente de la mascota, junto con sus registros de seguimiento.                          | Adoptante con adopción activa / Administrador |
| GET       | `/api/mascotas/{id}/expediente/descarga`      | Genera y descarga el expediente de la mascota.                                                         | Adoptante con adopción activa / Administrador |
| GET       | `/api/mascotas/{id}/seguimientos`             | Consulta los registros de seguimiento de una mascota.                                                  | Adoptante con adopción activa / Administrador |
| POST      | `/api/mascotas/{id}/seguimientos`             | Agrega una vacuna, consulta, desparasitación, tratamiento o registro de peso.                          | Adoptante con adopción activa / Administrador |
| PUT       | `/api/seguimientos/{id}`                      | Actualiza un registro de seguimiento existente.                                                        | Adoptante autorizado / Administrador |

## Ejemplos de datos JSON

### Crear una solicitud

Ruta: `POST /api/solicitudes`

```json
{
  "id_mascota": 12,
  "mensaje": "Me interesa adoptar a esta mascota."
}

Crear una solicitud

Ruta: PUT /api/solicitudes/25
{
  "estado": "APROBADA",
  "observaciones_revision": "Solicitud aprobada por el administrador."
}
Agregar un registro de seguimiento
Ruta: POST /api/mascotas/12/seguimientos
{
  "tipo": "VACUNA",
  "nombre": "Vacuna antirrábica",
  "fecha_evento": "2026-11-10",
  "descripcion": "Aplicada durante revisión veterinaria.",
  "peso_kg": null,
  "veterinario": "Clínica veterinaria",
  "proxima_fecha": "2027-11-10"
}
Reglas generales
- Los endpoints que crean o actualizan información recibirán datos en JSON, excepto cuando se implemente la descarga del expediente.
- El administrador solo podrá modificar las mascotas y revisar las solicitudes del refugio.
- Un adoptante solo podrá consultar o modificar sus propios datos y solicitudes.
- El acceso del adoptante al expediente y al seguimiento requiere una adopción activa de esa mascota.
- La baja de una mascota conservará su expediente y sus solicitudes.
- La descarga del expediente devolverá un archivo PDF generado con los datos de la mascota, su expediente y sus registros de seguimiento.