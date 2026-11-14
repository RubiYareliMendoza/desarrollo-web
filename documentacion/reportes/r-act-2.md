# Reporte de Avance del Proyecto

**Equipo:**  02
**Fecha:** 13 de noviembre  
**Número de reporte:**  02
**Repositorio GitHub:**  https://github.com/RubiYareliMendoza/desarrollo-web.git

---

# 1. Actividades realizadas

Durante esta segunda etapa comenzamos el desarrollo de la API REST de nuestro sistema de adopción de mascotas. Configuramos el backend con Spring Boot y Maven, organizando las clases en modelos, repositorios, servicios y controladores. Desarrollamos las funciones para registrar y consultar mascotas mediante peticiones GET y POST, incluyendo validaciones básicas. También trabajamos en la creación y conexión de la base de datos MySQL. 
Finalmente, realizamos pruebas con curl para comprobar el registro, consulta y validación de mascotas.
---

# 2. Evidencias de trabajo

| Actividad | Integrante responsable | Enlace a commit |
|------------|------------------------|-----------------|
|Configuración de Spring Boot y desarrollo del módulo de mascotas |Rubi |d1cb48563cb041a0b60ffb2963f64c8e7d04fc3e |
|Implementación de la base de datos y módulo de usuarios |Alejandra |4d10b424d65baad3ee680e3a050001e879b39a18 |
|Conexión de Spring Boot con MySQL |Alejandra |4d10b424d65baad3ee680e3a050001e879b39a18 |
|Pruebas mediante Curl |Rubi | |
| | | |

---

# 3. Problemas encontrados

Durante el desarrollo tuvimos algunas dificultades con la configuración del entorno. Al principio, VS Code marcaba errores en los paquetes de Java, aunque el proyecto compilaba correctamente. Esto se solucionó al abrir el backend desde la carpeta correcta y actualizar el reconocimiento del proyecto Maven. También tuvimos problemas al conectar Spring Boot con MySQL, ya que alejandra usa un puerto difrente al mio y tenemos diferente IP, después de varias pruebas, identificamos la dirección de conexión adecuada y logramos iniciar el servidor correctamente.

---

# 4. Avance funcional

En esta segunda entrega logramos desarrollar la estructura inicial del backend y conectar nuestra aplicación con la base de datos MySQL.
El módulo de mascotas ya permite registrar y consultar información mediante peticiones POST y GET. También cuenta con validaciones básicas para evitar registros incompletos y asigna automáticamente el estado y la fecha de registro. También avanzamos en el módulo de usuarios y roles, junto con la creación de las tablas y relaciones de la base de datos.

---

# 5. Uso de IA generativa

Documentar el uso de herramientas de inteligencia artificial durante el desarrollo del proyecto.

- **Herramienta utilizada:** ChatGPT.
- **Actividad para la que se utilizó:** Como apoyo para configurar Spring Boot, dudas de las clases del módulo de mascotas y usuarios, agregar validaciones y solucionar errores de configuración y conexión con MySQL.
- **Código o contenido generado:** Consultas de codigo y resolución de dudas de funciones de los modulos creados, además de comandos para realizar pruebas y explicaciones sobre su funcionamiento.
- **Modificaciones realizadas por el equipo:** Organizamos el código de acuerdo con la estructura del proyecto, adaptamos los atributos al diseño de nuestra base de datos.
- **Forma en que se verificó el resultado:** Realizamos compilaciones con Maven, iniciamos el servidor Spring Boot y probamos los endpoints mediante curl.

> Si no se utilizó IA, indicarlo expresamente.

---

# 6. Participación individual

Describir brevemente la contribución de cada integrante.

- **Integrante 1(RUBI):** Se encargó de configurar el proyecto Spring Boot y desarrollar el módulo de mascotas, incluyendo las clases del modelo, repositorio, servicio y controlador. Implementó las operaciones GET y POST, agregó validaciones y realizó pruebas con curl para comprobar su funcionamiento y conexión con MySQL.
- **Integrante 2(ALEJANDRA):** Se encargó de preparar la base de datos MySQL mediante el archivo schema.sql y avanzar en el módulo de usuarios y roles, desarrollando las clases necesarias para manejar esta información dentro del sistema.

---

# 7. Próximas actividades

Indicar las tareas que se realizarán antes del siguiente reporte.

- Actividad 1: Implementar PUT y DELETE: agregar las funciones para actualizar y eliminar registros mediante la API REST.
- Actividad 2: Incorporar filtros: permitir búsquedas y consultas específicas de la información registrada.
- Actividad 3: Implementar observaciones: agregar el manejo de observaciones dentro de los módulos correspondientes del sistema.
- Actividad 4: Validar respuestas HTTP: comprobar que los endpoints devuelvan los códigos de respuesta adecuados.
- Actividad 5: Probar la persistencia: verificar que los datos se guarden, actualicen y eliminen correctamente en MySQL.

---

## Observaciones adicionales

Durante esta etapa acordamos organizar el backend por capas para facilitar el desarrollo y la integración de los módulos realizados por cada integrante. También decidimos utilizar MySQL como base de datos.
