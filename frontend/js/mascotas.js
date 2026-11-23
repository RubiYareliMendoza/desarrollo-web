/* =========================================================
   1. CONFIGURACIÓN Y ELEMENTOS DE LA PÁGINA
========================================================= */

const API_MASCOTAS = "http://localhost:8080/api/mascotas";
const URL_BACKEND = new URL(API_MASCOTAS).origin;

const usuarioActual = JSON.parse(
    sessionStorage.getItem("usuarioActual") || "null"
);
const esAdministrador = usuarioActual?.nombreRol === "ADMINISTRADOR";

const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;
const FORMATOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"];

const listaMascotas = document.getElementById("lista-mascotas");
const mensajeCatalogo = document.getElementById("mensaje-catalogo");

const formularioFiltros = document.getElementById("form-filtros");

const formularioRegistro = document.getElementById("form-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

// Muestra mensajes de éxito, advertencia o error en el registro.
function mostrarMensajeRegistro(texto, tipo) {
    mensajeRegistro.classList.remove(
        "mensaje-exito",
        "mensaje-advertencia",
        "mensaje-error"
    );

    mensajeRegistro.textContent = texto;

    if (tipo) {
        mensajeRegistro.classList.add(`mensaje-${tipo}`);
    }
}

const formularioEdicion = document.getElementById("form-edicion");
const seccionEdicion = document.getElementById("seccion-edicion");
const mensajeEdicion = document.getElementById("mensaje-edicion");

function configurarInterfazPorRol() {
    const enlaceSolicitudes =
        document.getElementById("link-mis-solicitudes");
    const accesoRegistro =
        document.querySelector(".acceso-registro");

    if (enlaceSolicitudes) {
        if (esAdministrador) {
            enlaceSolicitudes.textContent = "Solicitudes";
            enlaceSolicitudes.hidden = false;
        } else if (usuarioActual?.nombreRol === "ADOPTANTE") {
            enlaceSolicitudes.textContent = "Mis solicitudes";
            enlaceSolicitudes.hidden = false;
        }
    }

    if (accesoRegistro) {
        accesoRegistro.hidden = !esAdministrador;
    }

    if (!esAdministrador) {
        document.getElementById("seccion-registro").hidden = true;
        seccionEdicion.hidden = true;
    }
}

// Obtiene el valor de un campo y elimina espacios innecesarios.
function valor(id) {
    return document.getElementById(id).value.trim();
}


// Reúne los datos utilizados al registrar o editar una mascota.
function obtenerDatosMascota(prefijo) {
    return {
        nombre: valor(`${prefijo}-nombre`),
        especie: valor(`${prefijo}-especie`),
        raza: valor(`${prefijo}-raza`),
        sexo: valor(`${prefijo}-sexo`),
        tamano: valor(`${prefijo}-tamano`),
        fechaNacimientoEstimada: valor(`${prefijo}-fecha-nacimiento`) || null,
        descripcion: valor(`${prefijo}-descripcion`)
    };
}

/**
 * Calcula la edad aproximada a partir de la fecha de nacimiento.
 * Devuelve años y meses, o un mensaje si no existe una fecha.
 */
function calcularEdad(fechaNacimientoEstimada) {

    // Si no existe una fecha, no podemos calcular la edad.
    if (!fechaNacimientoEstimada) {
        return "No especificada";
    }

    // Separar año, mes y día de la fecha recibida.
    const [anio, mes, dia] = fechaNacimientoEstimada
        .substring(0, 10)
        .split("-")
        .map(Number);

    const nacimiento = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    // Comprobar que sea una fecha válida y no sea futura.
    if (
        Number.isNaN(nacimiento.getTime()) ||
        nacimiento.getFullYear() !== anio ||
        nacimiento.getMonth() !== mes - 1 ||
        nacimiento.getDate() !== dia ||
        nacimiento > hoy
    ) {
        return "No especificada";
    }

    let anios = hoy.getFullYear() - anio;
    let meses = hoy.getMonth() - (mes - 1);

    // Descontar el mes actual si todavía no llega el día.
    if (hoy.getDate() < dia) {
        meses--;
    }

    // Ajustar cuando los meses son negativos.
    if (meses < 0) {
        anios--;
        meses += 12;
    }

    // Preparar el texto según la edad calculada.
    if (anios === 0 && meses === 0) {
        return "Menos de 1 mes";
    }

    const partes = [];

    if (anios > 0) {
        partes.push(`${anios} ${anios === 1 ? "año" : "años"}`);
    }

    if (meses > 0) {
        partes.push(`${meses} ${meses === 1 ? "mes" : "meses"}`);
    }

    return partes.join(" y ");
}


/* =========================================================
   2. CONSULTAR Y MOSTRAR MASCOTAS (GET)
========================================================= */

// Consulta las mascotas del backend y permite aplicar filtros.
async function cargarMascotas(filtros = {}) {
    mensajeCatalogo.textContent = "Cargando mascotas...";
    listaMascotas.replaceChildren();

    try {
        const url = new URL(API_MASCOTAS);

        // Agrega únicamente los filtros que tienen valor.
        for (const [campo, contenido] of Object.entries(filtros)) {
            if (contenido) {
                url.searchParams.set(campo, contenido);
            }
        }

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const mascotas = await respuesta.json();

        if (!Array.isArray(mascotas)) {
            throw new Error("La respuesta del servidor no es válida");
        }

        mostrarMascotas(mascotas);

    } catch (error) {
        console.error("Error al consultar mascotas:", error);

        mensajeCatalogo.textContent =
            "No se pudieron cargar las mascotas. Verifica la conexión con el servidor.";
    }
}


// Construye las tarjetas con la información de cada mascota.
function mostrarMascotas(mascotas) {
    listaMascotas.replaceChildren();

    mensajeCatalogo.textContent = mascotas.length
        ? `Se encontraron ${mascotas.length} mascota(s).`
        : "No hay mascotas registradas.";

    mascotas.forEach((mascota) => {

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-mascota";


        // Crear el contenedor de la fotografía.
        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "contenedor-imagen-mascota";

        // Crear la imagen principal.
        const imagen = document.createElement("img");
        imagen.className = "mascota-imagen";
        imagen.alt = `Fotografía de ${mascota.nombre || "la mascota"}`;

        // Crear un espacio alternativo cuando no exista fotografía.
        const imagenAlternativa = document.createElement("div");
        imagenAlternativa.className = "imagen-alternativa";
        imagenAlternativa.hidden = true;

        const icono = document.createElement("span");
        icono.className = "icono-huella";
        icono.textContent = "🐾";

        const texto = document.createElement("span");
        texto.textContent = "Fotografía no disponible";

        imagenAlternativa.append(icono, texto);

        // Mostrar la imagen real o el espacio alternativo.
        if (mascota.imagenPrincipalUrl) {
            imagen.src = new URL(
                mascota.imagenPrincipalUrl,
                URL_BACKEND
            ).href;
        } else {
            imagen.hidden = true;
            imagenAlternativa.hidden = false;
        }

        // Mostrar la alternativa si falla la carga de la fotografía.
        imagen.addEventListener("error", () => {
            imagen.hidden = true;
            imagenAlternativa.hidden = false;
        });

        contenedorImagen.append(imagen, imagenAlternativa);

        const contenido = document.createElement("div");
        contenido.className = "tarjeta-contenido";

        // Encabezado de la tarjeta: nombre y estado.
        const encabezadoTarjeta = document.createElement("div");
        encabezadoTarjeta.className = "encabezado-tarjeta";

        const nombre = document.createElement("h3");
        nombre.textContent = mascota.nombre || "Sin nombre";

        // Crear una etiqueta visual según el estado.
        const etiquetaEstado = document.createElement("span");
        etiquetaEstado.className = "etiqueta-estado";

        const estados = {
            DISPONIBLE: "Disponible",
            EN_PROCESO: "En proceso",
            ADOPTADA: "Adoptada",
            INACTIVA: "Inactiva"
        };

        const estadoMascota = mascota.estado || "";

        etiquetaEstado.textContent =
            estados[estadoMascota] || "Sin estado";

        // Asignar una clase segura para aplicar el color.
        const clasesEstado = {
            DISPONIBLE: "estado-disponible",
            EN_PROCESO: "estado-proceso",
            ADOPTADA: "estado-adoptada",
            INACTIVA: "estado-inactiva"
        };

        etiquetaEstado.classList.add(
            clasesEstado[estadoMascota] || "estado-inactiva"
        );

        encabezadoTarjeta.append(nombre, etiquetaEstado);
        contenido.appendChild(encabezadoTarjeta)

        // Mostrar especie y raza debajo del nombre.
        const tipoMascota = document.createElement("p");
        tipoMascota.className = "tipo-mascota";
        tipoMascota.textContent =
            `${mascota.especie || "No especificada"} · ${mascota.raza || "Sin raza especificada"}`;

        contenido.appendChild(tipoMascota);

        // Crear una cuadrícula con las características principales.
        const caracteristicas = document.createElement("div");
        caracteristicas.className = "caracteristicas-mascota";


        // Seleccionar el icono según el sexo de la mascota.
        let iconoSexo = "⚥";

        if (mascota.sexo === "Hembra") {
            iconoSexo = "♀";
        } else if (mascota.sexo === "Macho") {
            iconoSexo = "♂";
        }

        // Características principales de la mascota.
        const datos = [
            [iconoSexo, mascota.sexo || "No especificado"],
            ["📏", mascota.tamano || "No especificado"],
            ["📅", calcularEdad(mascota.fechaNacimientoEstimada)]
        ];


        datos.forEach(([icono, texto]) => {
            const elemento = document.createElement("div");
            elemento.className = "caracteristica";

            const simbolo = document.createElement("span");
            simbolo.className = "caracteristica-icono";
            simbolo.textContent = icono;
            simbolo.setAttribute("aria-hidden", "true");

            const valor = document.createElement("span");
            valor.textContent = texto;

            elemento.append(simbolo, valor);
            caracteristicas.appendChild(elemento);
        });

        contenido.appendChild(caracteristicas);


        const estaInactiva = mascota.estado === "INACTIVA";

        // Botón para consultar la información completa.
        const botonDetalles = document.createElement("button");
        botonDetalles.type = "button";
        botonDetalles.textContent = "Ver detalles";
        botonDetalles.className = "boton-detalles";

        // Abrir la ventana con la mascota seleccionada.
        botonDetalles.addEventListener("click", () => {
            abrirDetallesMascota(mascota);
        });

        // Botón para consultar el expediente digital.
        const botonExpediente = document.createElement("button");
        botonExpediente.type = "button";
        botonExpediente.textContent = "🐾 Ver expediente";
        botonExpediente.className = "boton-expediente";

        // Abrir el expediente de la mascota seleccionada.
        botonExpediente.addEventListener("click", () => {
            window.location.href =
                `expedientes.html?idMascota=${mascota.idMascota}`;
        });

        // Botón para editar la mascota.
        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.disabled = estaInactiva;

        if (estaInactiva) {
            botonEditar.title =
                "No se puede editar una mascota inactiva";
        } else {
            botonEditar.addEventListener("click", () => {
                abrirFormularioEdicion(mascota);
            });
        }

        // Botón para desactivar la mascota.
       const botonDesactivar = document.createElement("button");
        botonDesactivar.type = "button";
        botonDesactivar.textContent = "Desactivar";
        botonDesactivar.disabled = estaInactiva;

        if (estaInactiva) {
            botonDesactivar.title = "Esta mascota ya está inactiva";
        } else {
            botonDesactivar.addEventListener("click", () => {
                desactivarMascota(mascota);
            });
        }
        const accionesTarjeta = document.createElement("div");
      
       accionesTarjeta.className = "acciones-tarjeta";
        accionesTarjeta.append(botonDetalles, botonExpediente);

        if (esAdministrador) {
            const accionesAdministrativas = document.createElement("div");
            accionesAdministrativas.className = "acciones-administrativas";
            accionesAdministrativas.append(botonEditar, botonDesactivar);
            accionesTarjeta.appendChild(accionesAdministrativas);
        }

        contenido.appendChild(accionesTarjeta);

                tarjeta.append(contenedorImagen, contenido);

                listaMascotas.appendChild(tarjeta);
            });
        }

/* =========================================================
   CONSULTAR DETALLES DE UNA MASCOTA
========================================================= */

// Abre la ventana y muestra los datos de la mascota seleccionada.
function abrirDetallesMascota(mascota) {

    
    const modal = document.getElementById("modal-detalles");
    const imagen = document.getElementById("detalle-imagen");

    const imagenAlternativa = document.getElementById(
        "detalle-imagen-alternativa"
    );

    // Ocultar ambas opciones antes de cargar la fotografía.
    imagen.hidden = true;
    imagenAlternativa.hidden = true;
    imagen.removeAttribute("src");

    // Mostrar la huellita si la imagen no puede cargarse.
    imagen.onerror = () => {
        imagen.hidden = true;
        imagenAlternativa.hidden = false;
    };

    if (mascota.imagenPrincipalUrl) {
        // Mostrar la fotografía guardada.
        imagen.src = new URL(
            mascota.imagenPrincipalUrl,
            URL_BACKEND
        ).href;

        imagen.hidden = false;

    } else {
        // Mostrar la huellita si no existe fotografía.
        imagenAlternativa.hidden = false;
    }

    // Mostrar la información de la mascota.
    document.getElementById("detalle-nombre").textContent =
        mascota.nombre || "Sin nombre";

    document.getElementById("detalle-especie").textContent =
        `Especie: ${mascota.especie || "No especificada"}`;

    document.getElementById("detalle-raza").textContent =
        `Raza: ${mascota.raza || "No especificada"}`;

    document.getElementById("detalle-sexo").textContent =
        `Sexo: ${mascota.sexo || "No especificado"}`;

    document.getElementById("detalle-tamano").textContent =
        `Tamaño: ${mascota.tamano || "No especificado"}`;

    document.getElementById("detalle-estado").textContent =
        `Estado: ${mascota.estado || "No especificado"}`;


    document.getElementById("detalle-edad").textContent =
        `Edad aproximada: ${calcularEdad(mascota.fechaNacimientoEstimada)}`;

    document.getElementById("detalle-descripcion").textContent =
        mascota.descripcion || "Sin descripción disponible.";

    // Mostrar la ventana de detalles.
    modal.showModal();
}


// Cierra la ventana cuando se presiona el botón correspondiente.
document.getElementById("cerrar-detalles")
    .addEventListener("click", () => {
        document.getElementById("modal-detalles").close();
    });



/* =========================================================
   3. GESTIÓN DE FOTOGRAFÍAS
========================================================= */

// Comprueba que una fotografía tenga formato y tamaño válidos.
function validarFotografia(archivo) {
    if (!FORMATOS_IMAGEN.includes(archivo.type)) {
        throw new Error(
            "Selecciona una imagen JPG, PNG o WebP."
        );
    }

    if (archivo.size > TAMANO_MAXIMO_IMAGEN) {
        throw new Error(
            "La imagen no debe superar los 5 MB."
        );
    }
}


// Configura la vista previa al seleccionar una fotografía.
function configurarVistaPrevia(
    idInput,
    idImagen,
    idTexto,
    mensajeInicial
) {
    const input = document.getElementById(idInput);
    const imagen = document.getElementById(idImagen);
    const texto = document.getElementById(idTexto);

    let urlTemporal = null;

    // Limpia la fotografía seleccionada y su vista previa.
    function limpiar() {
        if (urlTemporal) {
            URL.revokeObjectURL(urlTemporal);
        }

        urlTemporal = null;

        input.value = "";
        imagen.removeAttribute("src");
        imagen.hidden = true;
        texto.textContent = mensajeInicial;
    }

    // Detecta cuando se selecciona una fotografía.
    input.addEventListener("change", () => {

        if (urlTemporal) {
            URL.revokeObjectURL(urlTemporal);
        }

        urlTemporal = null;

        imagen.removeAttribute("src");
        imagen.hidden = true;

        const archivo = input.files[0];

        if (!archivo) {
            texto.textContent = mensajeInicial;
            return;
        }

        try {
            validarFotografia(archivo);

            // Crea una dirección temporal para mostrar la imagen.
            urlTemporal = URL.createObjectURL(archivo);

            imagen.src = urlTemporal;
            imagen.hidden = false;

            texto.textContent =
                `Fotografía seleccionada: ${archivo.name}`;

        } catch (error) {
            input.value = "";
            texto.textContent = error.message;
        }
    });

    return limpiar;
}


// Vista previa del formulario de registro.
const limpiarImagenRegistro = configurarVistaPrevia(
    "registro-imagen",
    "vista-previa-registro",
    "vista-previa-registro-texto",
    "No se ha seleccionado ninguna fotografía."
);


// Vista previa del formulario de edición.
const limpiarImagenEdicion = configurarVistaPrevia(
    "editar-imagen",
    "vista-previa-edicion",
    "vista-previa-edicion-texto",
    "Si no seleccionas otra fotografía, se conservará la actual."
);


// Envía la fotografía al backend mediante FormData.
async function subirFotografia(idMascota, archivo) {
    if (!archivo) {
        return null;
    }

    validarFotografia(archivo);

    const datosFormulario = new FormData();
    datosFormulario.append("archivo", archivo);

    const respuesta = await fetch(
        `${API_MASCOTAS}/${encodeURIComponent(idMascota)}/imagen`,
        {
            method: "POST",
            body: datosFormulario
        }
    );

    // El navegador configura automáticamente multipart/form-data.
    if (!respuesta.ok) {
        throw new Error(
            `No se pudo subir la fotografía. HTTP ${respuesta.status}`
        );
    }

    return respuesta.json();
}


/* =========================================================
   4. REGISTRAR MASCOTA (POST)
========================================================= */

// Registra una mascota y después sube su fotografía, si existe.
async function registrarMascota(evento) {
    evento.preventDefault();

    const datosMascota = obtenerDatosMascota("registro");

    // Validar los campos obligatorios.
    if (!datosMascota.nombre || !datosMascota.especie) {
        mostrarMensajeRegistro(
            "El nombre y la especie son obligatorios.","error"
        );
        return;
    }

    const boton = formularioRegistro.querySelector(
        'button[type="submit"]'
    );

    boton.disabled = true;
    mostrarMensajeRegistro("Registrando mascota...", null);

    try {
        // Registrar los datos mediante POST.
        const respuesta = await fetch(API_MASCOTAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosMascota)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const mascotaRegistrada = await respuesta.json();

        // Obtener la fotografía seleccionada.
        const archivo = document.getElementById(
            "registro-imagen"
        ).files[0];

        let imagenGuardada = true;

        // Asociar la fotografía a la mascota recién registrada.
        if (archivo) {
            mostrarMensajeRegistro(
                "Mascota registrada. Subiendo fotografía...", null
            );

            try {
                await subirFotografia(
                    mascotaRegistrada.idMascota,
                    archivo
                );

            } catch (errorImagen) {
                imagenGuardada = false;

                console.error(
                    "Error al subir fotografía:",
                    errorImagen
                );
            }
        }

        // Limpiar el formulario y la vista previa.
        formularioRegistro.reset();
        limpiarImagenRegistro();

        // Actualizar el catálogo.
        await cargarMascotas();

       
        // Mostrar el resultado del registro.
        if (imagenGuardada) {
            // Registro y fotografía guardados correctamente.
            mostrarMensajeRegistro(
                `¡${mascotaRegistrada.nombre} fue registrada correctamente!`,
                "exito"
            );

        } else {
            // La mascota se registró, pero falló la fotografía.
            mostrarMensajeRegistro(
                `${mascotaRegistrada.nombre} fue registrada, pero no se pudo guardar su fotografía. Puedes agregarla después desde Editar.`,
                "advertencia"
            );
        }

        // Cerrar el formulario porque la mascota ya fue registrada.
        const seccionRegistro = document.getElementById("seccion-registro");
        const botonRegistro = document.getElementById("toggle-registro");

        seccionRegistro.hidden = true;
        botonRegistro.textContent = "+ Registrar mascota";
        botonRegistro.setAttribute("aria-expanded", "false");

        // Llevar al usuario al resultado del registro.
        mensajeRegistro.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    } catch (error) {
        console.error("Error al registrar mascota:", error);

        mostrarMensajeRegistro("No se pudo registrar la mascota. Revisa los datos e inténtalo nuevamente.","error");

    } finally {
        boton.disabled = false;
    }
}


/* =========================================================
   5. EDITAR MASCOTA (PUT)
========================================================= */

// Abre el formulario y coloca los datos de la mascota seleccionada.
function abrirFormularioEdicion(mascota) {
    document.getElementById("editar-id").value =
        mascota.idMascota;

    document.getElementById("editar-nombre").value =
        mascota.nombre || "";

    document.getElementById("editar-especie").value =
        mascota.especie || "Perro";

    document.getElementById("editar-raza").value =
        mascota.raza || "";

    document.getElementById("editar-sexo").value =
        mascota.sexo || "";

    document.getElementById("editar-tamano").value =
        mascota.tamano || "";

    document.getElementById("editar-fecha-nacimiento").value =
        mascota.fechaNacimientoEstimada || "";

    document.getElementById("editar-descripcion").value =
        mascota.descripcion || "";

    // Mostrar la fotografía que ya tiene guardada la mascota.
    const imagenActual = document.getElementById(
        "editar-imagen-actual"
    );

    const textoImagenActual = document.getElementById(
        "editar-imagen-actual-texto"
    );

    if (mascota.imagenPrincipalUrl) {
        imagenActual.src = new URL(
            mascota.imagenPrincipalUrl,
            URL_BACKEND
        ).href;

        imagenActual.alt = `Fotografía actual de ${mascota.nombre}`;
        imagenActual.hidden = false;

        textoImagenActual.textContent =
            "Esta es la fotografía guardada. Solo selecciona otra si deseas cambiarla.";

    } else {
        imagenActual.removeAttribute("src");
        imagenActual.hidden = true;

        textoImagenActual.textContent =
            "Esta mascota todavía no tiene una fotografía registrada.";
    }


    limpiarImagenEdicion();

    mensajeEdicion.textContent = "";
    seccionEdicion.hidden = false;

    seccionEdicion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Limpia y oculta el formulario de edición.
function cerrarFormularioEdicion() {
    formularioEdicion.reset();
    limpiarImagenEdicion();

    seccionEdicion.hidden = true;
    mensajeEdicion.textContent = "";
}


// Actualiza una mascota y cambia su fotografía si se seleccionó otra.
async function actualizarMascota(evento) {
    evento.preventDefault();

    const idMascota = document.getElementById(
        "editar-id"
    ).value;

    const datos = obtenerDatosMascota("editar");

    // Validar los campos obligatorios.
    if (!datos.nombre || !datos.especie) {
        mensajeEdicion.textContent =
            "El nombre y la especie son obligatorios.";
        return;
    }

    const boton = formularioEdicion.querySelector(
        'button[type="submit"]'
    );

    boton.disabled = true;
    mensajeEdicion.textContent = "Guardando cambios...";

    try {
        // Actualizar los datos mediante PUT.
        const respuesta = await fetch(
            `${API_MASCOTAS}/${encodeURIComponent(idMascota)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            }
        );

        if (respuesta.status === 404) {
            throw new Error("La mascota no existe.");
        }

        if (respuesta.status === 409) {
            throw new Error(
                "No se puede editar una mascota inactiva."
            );
        }

        if (!respuesta.ok) {
            throw new Error(
                `No se pudo actualizar. HTTP ${respuesta.status}`
            );
        }

        // Comprobar si se seleccionó una fotografía nueva.
        const archivo = document.getElementById(
            "editar-imagen"
        ).files[0];

        let imagenGuardada = true;

        if (archivo) {
            mensajeEdicion.textContent =
                "Datos actualizados. Subiendo fotografía...";

            try {
                await subirFotografia(idMascota, archivo);

            } catch (errorImagen) {
                imagenGuardada = false;

                console.error(
                    "Error al actualizar fotografía:",
                    errorImagen
                );
            }
        }

        // Mostrar los datos actualizados en el catálogo.
        await cargarMascotas();

        if (imagenGuardada) {
            alert("¡Mascota actualizada correctamente!");

            cerrarFormularioEdicion();

            // Regresar a la sección del catálogo.
            document.querySelector(".catalogo").scrollIntoView({
                behavior: "smooth"
            });

        } else {
            mensajeEdicion.textContent =
                "Los datos se actualizaron, pero no se pudo guardar la fotografía. Puedes intentar subirla nuevamente.";
        }

    } catch (error) {
        console.error("Error al actualizar mascota:", error);
        mensajeEdicion.textContent = error.message;

    } finally {
        boton.disabled = false;
    }
}


/* =========================================================
   6. DESACTIVAR MASCOTA (DELETE)
========================================================= */

// Desactiva una mascota sin eliminar su registro de MySQL.
async function desactivarMascota(mascota) {

    const confirmar = confirm(
        `¿Estás segura de que deseas desactivar a ${mascota.nombre}?`
    );

    if (!confirmar) {
        return;
    }

    try {
        // Enviar la petición DELETE al backend.
        const respuesta = await fetch(
            `${API_MASCOTAS}/${encodeURIComponent(mascota.idMascota)}`,
            {
                method: "DELETE"
            }
        );

        if (respuesta.status === 404) {
            throw new Error("La mascota no existe.");
        }

        if (respuesta.status === 409) {
            throw new Error(
                "No se puede desactivar esta mascota por su estado."
            );
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        alert(
            `${mascota.nombre} fue desactivada correctamente.`
        );

        // Actualizar las tarjetas después de desactivar.
        await cargarMascotas();

    } catch (error) {
        console.error("Error al desactivar mascota:", error);

        alert(
            `No se pudo desactivar la mascota: ${error.message}`
        );
    }
}


/* =========================================================
   VALIDACIÓN DE FECHAS DE NACIMIENTO
========================================================= */

// Obtiene la fecha actual en formato YYYY-MM-DD.
function obtenerFechaActual() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}


// Evita seleccionar fechas posteriores al día actual.
function configurarFechaNacimiento() {
    const fechaActual = obtenerFechaActual();

    const campos = [
        document.getElementById("registro-fecha-nacimiento"),
        document.getElementById("editar-fecha-nacimiento")
    ];

    campos.forEach((campo) => {
        campo.max = fechaActual;
    });
}

/* =========================================================
   MOSTRAR Y OCULTAR FORMULARIO DE REGISTRO
========================================================= */

// Abre o cierra el formulario de registro.
function alternarFormularioRegistro() {
    const seccion = document.getElementById("seccion-registro");
    const boton = document.getElementById("toggle-registro");

    const abrir = seccion.hidden;

    seccion.hidden = !abrir;

    boton.textContent = abrir
        ? "✕ Cerrar formulario"
        : "+ Registrar mascota";

    boton.setAttribute("aria-expanded", String(abrir));

    // Desplazarse al formulario cuando se abre.
    if (abrir) {
        seccion.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}



/* =========================================================
   7. EVENTOS DE LA PÁGINA
========================================================= */

// Aplicar los filtros seleccionados.
formularioFiltros.addEventListener("submit", (evento) => {
    evento.preventDefault();

    cargarMascotas({
        nombre: valor("buscar-nombre"),
        especie: valor("filtro-especie"),
        estado: valor("filtro-estado")
    });
});


// Limpiar filtros y consultar todas las mascotas.
formularioFiltros.addEventListener("reset", () => {
    cargarMascotas();
});


// Registrar una nueva mascota.
formularioRegistro.addEventListener(
    "submit",
    registrarMascota
);


// Actualizar una mascota existente.
formularioEdicion.addEventListener(
    "submit",
    actualizarMascota
);


// Cancelar y cerrar el formulario de edición.
document.getElementById("cancelar-edicion")
    .addEventListener("click", cerrarFormularioEdicion);


// Cargar el catálogo al abrir PawMach.
document.addEventListener("DOMContentLoaded", () => {
    configurarInterfazPorRol();
    cargarMascotas();
    configurarFechaNacimiento();
});

// Mostrar u ocultar el formulario al presionar el botón.
document.getElementById("toggle-registro")
    .addEventListener("click", alternarFormularioRegistro);




