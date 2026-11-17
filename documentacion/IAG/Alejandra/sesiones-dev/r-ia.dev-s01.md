# Reporte de IA Desarrollo en el Proyecto

**Fecha:** 16/11/2026 
**Número de reporte:**  1

---

# 1. Breve descripción de uso

Describir la intención general del desarrollo.

---

# 2. Evidencias de uso


| Evidencia               | Formato                |
| ----------------------- | ---------------------- |
| Herramienta             | Chat GPT               |
| Modelo/temperatura      | GPT normal             |
| Prompt original         | Ayúdame a implementar PUT /api/usuarios/{id} para actualizar nombres, apellidos, teléfono y dirección. Debe verificar que exista el usuario, validar los datos y evitar que se modifiquen la contraseña y el rol |
| Respuesta de IA         | Propuso agregar un método al servicio que busca el usuario por ID, responde 404 si no existe, actualiza únicamente los cuatro campos permitidos, guarda los cambios y devuelve un DTO sin contraseña. |
| Código anterior         | 11824c7                |
| Código posterior        | 7f1cb97                |
| Diferencias entre versiones | 21    2    backend/src/main/java/com/huellitas/backend/controller/UsuarioController.java 22    0    backend/src/main/java/com/huellitas/backend/dto/UsuarioActualizarDTO.java 11    1    backend/src/main/java/com/huellitas/backend/repository/UsuarioRepository.java 56    5    backend/src/main/java/com/huellitas/backend/service/UsuarioService.java 28    0    documentacion/IAG/Alejandra/r-ia-doc-02.md 17    15   documentacion/IAG/Alejandra/sesiones-dev/r-ia.dev-s01.md |
| Prueba de funcionamiento | curl -i -X PUT http://localhost:8080/api/usuarios/1 \   -H "Content-Type: application/json" \   -d '{"nombres":"Usuario actualizado","apellidos":"Prueba PUT","telefono":"5551112222","direccion":"Dirección actualizada"}' |
| Código de uso           | @Transactional public UsuarioRespuestaDTO actualizarUsuario(         Long id,         UsuarioActualizarDTO datos) {      Usuario usuario = usuarioRepository.findById(id)             .orElseThrow(() -> new ResponseStatusException(                     HttpStatus.NOT_FOUND,                     "No se encontró el usuario con ID " + id));      usuario.setNombres(datos.nombres());     usuario.setApellidos(datos.apellidos());     usuario.setTelefono(datos.telefono());     usuario.setDireccion(datos.direccion());      Usuario actualizado = usuarioRepository.save(usuario);     return convertirARespuesta(actualizado); } |
| Reflexion del estudiante | implemente el metodo de actualizarUsuario en el servicio. lo que hace el metodo es que recibe el identificador y los datos que se van a actualizar mediante el DTO, primero busca el usuario en la bd y si no existe ya nos devuelve un 404, si si lo encuentrea entonces modifica el nombre, apellido, telefono y direccion y tambien guarda los cambios en MySQL, y devuelve los datos actualizados, la contraseña y el rol no estan en esos campos que se pueden modificar |
|                         |                        |


> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

---

## Observaciones adicionales

Observe como se puede hacer la acción de actualizar varios campos, y hacer la conexion con las otras clases que tenemos que tambíen nos ayudan a actualizar
