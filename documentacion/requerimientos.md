# Especificación de requerimientos — Huellitas (nombre a definir)

## 1. Descripción general

Huellitas es un sistema web diseñado para apoyar la administración de adopciones de mascotas de un refugio. Su propósito es facilitar la consulta de animales disponibles, la gestión de solicitudes de adopción y el seguimiento de la salud y bienestar de las mascotas.

El sistema permitirá que las personas interesadas consulten las mascotas disponibles y soliciten su adopción. Por otra parte, el administrador del refugio podrá registrar mascotas, gestionar sus expedientes y revisar las solicitudes recibidas.

Una vez concretada una adopción, el adoptante podrá consultar el expediente digital de su mascota y registrar información relacionada con sus cuidados, como vacunas, visitas veterinarias, desparasitaciones, tratamientos y peso.

El sistema estará diseñado para un solo refugio y contará con dos tipos de usuarios: adoptante y administrador.

## 2. Objetivo general

Desarrollar una aplicación web que permita administrar las adopciones de mascotas de un refugio, mantener expedientes digitales y facilitar el seguimiento de los cuidados de los animales después de su adopción.

## 3. Objetivos específicos

- Facilitar la consulta de mascotas disponibles para adopción.
- Permitir el registro de usuarios interesados en adoptar.
- Gestionar las solicitudes de adopción y sus estados.
- Mantener un expediente digital individual para cada mascota.
- Permitir a los adoptantes registrar los cuidados de sus mascotas.
- Facilitar al administrador la consulta del historial de adopciones y seguimientos.
- Conservar la información histórica de las mascotas y sus adopciones.

## 4. Roles del sistema

### 4.1. Adoptante

Usuario registrado que puede consultar mascotas, enviar solicitudes de adopción y revisar su estado.

Cuando una adopción esté activa, podrá consultar el expediente de la mascota y registrar información sobre sus cuidados y seguimiento.

### 4.2. Administrador

Usuario responsable de gestionar la información del refugio, registrar mascotas, revisar solicitudes, concretar adopciones y consultar los expedientes y registros de seguimiento.

## 5. Requerimientos funcionales

### 5.1. Gestión de usuarios

| ID | Requerimiento |
|---|---|
| RF-01 | El sistema permitirá registrar cuentas de usuarios con el rol de adoptante. |
| RF-02 | El sistema permitirá iniciar sesión mediante correo electrónico y contraseña. |
| RF-03 | El sistema identificará el rol del usuario para determinar las funciones a las que puede acceder. |
| RF-04 | Los usuarios registrados podrán consultar y actualizar la información de su perfil. |

### 5.2. Gestión de mascotas

| ID | Requerimiento |
|---|---|
| RF-05 | El sistema permitirá consultar un catálogo de mascotas registradas en el refugio. |
| RF-06 | El sistema permitirá filtrar mascotas por características como especie y estado. |
| RF-07 | El sistema mostrará los datos generales de cada mascota, incluyendo nombre, especie, raza, sexo, tamaño, descripción y fotografía cuando esté disponible. |
| RF-08 | El administrador podrá registrar nuevas mascotas en el sistema. |
| RF-09 | El administrador podrá modificar los datos y el estado de las mascotas. |
| RF-10 | El administrador podrá dar de baja mascotas sin eliminar su historial. |

### 5.3. Gestión de solicitudes y adopciones

| ID | Requerimiento |
|---|---|
| RF-11 | Los adoptantes registrados podrán enviar solicitudes para adoptar mascotas disponibles. |
| RF-12 | Los adoptantes podrán consultar el estado de sus solicitudes. |
| RF-13 | Los adoptantes podrán cancelar sus solicitudes mientras estén pendientes. |
| RF-14 | El administrador podrá consultar las solicitudes recibidas y filtrarlas por estado. |
| RF-15 | El administrador podrá aprobar o rechazar solicitudes de adopción y registrar observaciones sobre su decisión. |
| RF-16 | El administrador podrá registrar una adopción a partir de una solicitud aprobada. |
| RF-17 | Al concretarse una adopción, el sistema actualizará el estado de la mascota a ADOPTADA. |

### 5.4. Expediente digital

| ID | Requerimiento |
|---|---|
| RF-18 | El sistema mantendrá un expediente digital individual para cada mascota. |
| RF-19 | El administrador podrá registrar y actualizar las observaciones generales del expediente. |
| RF-20 | El administrador podrá consultar los expedientes de las mascotas registradas. |
| RF-21 | El adoptante podrá consultar el expediente de una mascota cuando tenga una adopción activa de ella. |
| RF-22 | El sistema permitirá descargar el expediente de una mascota en formato PDF, incluyendo sus datos generales y registros de seguimiento. |

### 5.5. Seguimiento post-adopción

| ID | Requerimiento |
|---|---|
| RF-23 | El adoptante podrá registrar vacunas de sus mascotas adoptadas. |
| RF-24 | El adoptante podrá registrar consultas veterinarias, desparasitaciones, tratamientos y controles de peso. |
| RF-25 | Cada registro de seguimiento incluirá información como tipo, nombre, fecha del evento y descripción, además de otros datos cuando correspondan. |
| RF-26 | El adoptante podrá consultar el historial de seguimiento de sus mascotas. |
| RF-27 | El adoptante podrá actualizar los registros de seguimiento que esté autorizado a modificar. |
| RF-28 | El administrador podrá consultar los registros de seguimiento de las mascotas del refugio. |
| RF-29 | El sistema identificará al usuario responsable de crear cada registro de seguimiento. |

## 6. Requerimientos no funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | El sistema deberá desarrollarse con una arquitectura de tres capas: presentación, lógica de negocio y datos. |
| RNF-02 | La interfaz de usuario se implementará mediante HTML, CSS y JavaScript. |
| RNF-03 | La comunicación entre frontend y backend utilizará Fetch API y peticiones HTTP. |
| RNF-04 | El backend se desarrollará en Java utilizando Spring Boot. |
| RNF-05 | La base de datos será MySQL y se utilizará JPA/Hibernate para la persistencia. |
| RNF-06 | La API REST utilizará los métodos GET, POST, PUT y DELETE, según la operación. |
| RNF-07 | El intercambio de información se realizará principalmente mediante JSON. |
| RNF-08 | El sistema permitirá utilizar parámetros Query String para filtrar información en las consultas. |
| RNF-09 | El sistema deberá validar los datos ingresados por los usuarios. |
| RNF-10 | Las contraseñas deberán almacenarse mediante algoritmos de hash adecuados para contraseñas, sin guardar su valor original. |
| RNF-11 | El sistema deberá controlar el acceso a las funciones según el rol y los permisos del usuario. |
| RNF-12 | La interfaz deberá ser clara, fácil de utilizar y adaptable a diferentes tamaños de pantalla. |
| RNF-13 | La API deberá utilizar códigos de estado HTTP adecuados para indicar el resultado de las operaciones. |
| RNF-14 | El desarrollo y las pruebas deberán poder realizarse desde WSL. |
| RNF-15 | El código fuente se administrará mediante Git y GitHub. |
| RNF-16 | El repositorio incluirá instrucciones para configurar y ejecutar el sistema en otro entorno WSL. |

## 7. Reglas de negocio

- RN-01: El sistema estará destinado a un único refugio.
- RN-02: Solo existirán dos roles: ADOPTANTE y ADMINISTRADOR.
- RN-03: Los usuarios que se registren públicamente recibirán el rol ADOPTANTE.
- RN-04: El correo electrónico de cada usuario deberá ser único.
- RN-05: Solo el administrador podrá registrar, modificar o dar de baja mascotas.
- RN-06: Solo los adoptantes registrados podrán enviar solicitudes de adopción.
- RN-07: Las solicitudes únicamente podrán realizarse para mascotas disponibles.
- RN-08: Una solicitud deberá estar aprobada antes de registrar la adopción correspondiente.
- RN-09: Una mascota no podrá tener más de una adopción activa al mismo tiempo.
- RN-10: El adoptante solo podrá acceder a las solicitudes que le pertenezcan.
- RN-11: El adoptante solo podrá consultar o modificar el seguimiento de mascotas con las que tenga una adopción activa.
- RN-12: El administrador podrá consultar los expedientes y seguimientos de las mascotas registradas.
- RN-13: Cada mascota tendrá un único expediente digital.
- RN-14: Los registros de seguimiento deberán conservar la identificación del usuario que los creó.
- RN-15: Las bajas de mascotas deberán conservar los registros históricos de solicitudes, adopciones y expedientes.

## 8. Alcance del proyecto

El sistema incluirá el registro e inicio de sesión de adoptantes, administración de mascotas, solicitudes de adopción, registro de adopciones, expedientes digitales y seguimiento de cuidados.

Se desarrollará para un solo refugio y no incluirá múltiples organizaciones, pagos, mensajería en tiempo real ni roles adicionales.


## 9. Tecnologías propuestas

- **Frontend:** HTML, CSS y JavaScript.
- **Comunicación:** Fetch API, HTTP y JSON.
- **Backend:** Java con Spring Boot.
- **Persistencia:** JPA/Hibernate.
- **Base de datos:** MySQL.
- **Entorno:** WSL y Visual Studio Code.
- **Control de versiones:** Git y GitHub.

## 10. Conclusión

La definición de estos requerimientos establece las principales funciones que tendrá el sistema y las responsabilidades de cada tipo de usuario. También permite relacionar las funcionalidades con el diseño de la base de datos y los endpoints REST, facilitando la organización del desarrollo y las pruebas posteriores.