# Reporte de Avance del Proyecto

**Equipo:**  02
**Fecha:**  20 de noviembre
**Número de reporte:**  04
**Repositorio GitHub:**  https://github.com/RubiYareliMendoza/desarrollo-web.git

---

# 1. Actividades realizadas

Durante esta cuarta etapa desarrollamos las interfaces web de los módulos de mascotas y usuarios, utilizando HTML, CSS y JavaScript. Integramos ambos módulos con el backend de Spring Boot mediante Fetch API para realizar consultas, registros, actualizaciones y desactivaciones.
También incorporamos filtros de búsqueda, realizamos pruebas de funcionamiento y corregimos problemas de conexión entre el frontend y el backend. 

---

# 2. Evidencias de trabajo

| Actividad | Integrante responsable | Enlace a commit |
|------------|------------------------|-----------------|
|Desarrollo del frontend de mascotas con operaciones CRUD y filtros |Rubi |194fe8b960a27bc59c5638f00320db10475e52d5 |
|Desarrollo del frontend de usuarios y conexión con la API |Alejandra |eb6c1f732686f80d7bce3930123904f0f710ffdf |
|Integración de ambos módulos en el repositorio |Ambas |bde027946ff5b2c7c46b9ef111cd15654d65da61 |
|Pruebas de funcionamiento y conexión con MySQL |Ambas | |
| | | |

---

# 3. Problemas encontrados

Durante esta etapa tuvimos algunas dificultades al conectar las interfaces web con el backend, principalmente por la configuración de CORS, que impedía realizar peticiones desde el navegador. Lo solucionamos ajustando los orígenes permitidos en los controladores de Spring Boot.

---

# 4. Avance funcional

En esta cuarta etapa logramos integrar las interfaces web de mascotas y usuarios con el backend de Spring Boot mediante Fetch API.
El módulo de mascotas permite consultar, registrar, actualizar y desactivar registros, además de realizar búsquedas mediante filtros individuales y combinados. Por su parte, el módulo de usuarios cuenta con una interfaz para administrar registros y realizar consultas.

---

# 5. Uso de IA generativa

Documentar el uso de herramientas de inteligencia artificial durante el desarrollo del proyecto.

- **Herramienta utilizada:** ChatGPT
- **Actividad para la que se utilizó:**  Apoyo en el desarrollo del frontend, la conexión con el backend mediante Fetch API, la solución de errores y las pruebas de funcionamiento.
- **Código o contenido generado:** Ejemplos de código JavaScript para implementar formularios, filtros y operaciones CRUD.
- **Modificaciones realizadas por el equipo:** Revisamos y adaptamos el código a la estructura de nuestro sistema y a los endpoints de cada módulo que ya teniamos programados, realizando los ajustes necesarios durante la integración.
- **Forma en que se verificó el resultado:** Mediante pruebas desde el navegador, revisión de respuestas HTTP y consultas en MySQL para comprobar el funcionamiento y la persistencia de los datos.

> Si no se utilizó IA, indicarlo expresamente.

---

# 6. Participación individual

Describir brevemente la contribución de cada integrante.

- **Integrante 1 Rubi:** Desarrolló la interfaz del módulo de mascotas, implementando las operaciones GET, POST, PUT y DELETE, así como los filtros de búsqueda mediante Fetch API. 
- **Integrante 2 Alejandra:** Desarrolló la interfaz del módulo de usuarios, incorporando formularios, consultas y funciones para administrar la información mediante la conexión con el backend.

---

# 7. Próximas actividades

Indicar las tareas que se realizarán antes del siguiente reporte.

- Actividad 1: Realizar las pruebas finales de los módulos de mascotas y usuarios.
- Actividad 2: Mejorar el diseño y la navegación entre las interfaces.
- Actividad 3: Incorporar imágenes y detalles adicionales de las mascotas.
- Actividad 4: Completar la documentación y las evidencias del proyecto.
- Actividad 5: Preparar la demostración final y verificar el funcionamiento del sistema completo.

---

## Observaciones adicionales

Agregar cualquier comentario, acuerdo, decisión técnica o evidencia complementaria relevante para el proyecto.
