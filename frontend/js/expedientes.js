// 1. CONFIGURACIÓN

const URL_API = "http://localhost:8080";
const API_MASCOTAS = `${URL_API}/api/mascotas`;
const API_EXPEDIENTES = `${URL_API}/api/expedientes`;
const API_SEGUIMIENTO = `${URL_API}/api/registros-seguimiento`;
const parametros = new URLSearchParams(window.location.search);
const idMascota = parametros.get("idMascota");

// Elementos de la página
const mensajeExpediente = document.getElementById("mensaje-expediente");
const mensajeFormulario = document.getElementById("mensaje-formulario-expediente");

const seccionMascota = document.getElementById("seccion-mascota");
const seccionExpediente = document.getElementById("seccion-expediente");
const seccionSeguimiento = document.getElementById("seccion-seguimiento");

const formularioExpediente = document.getElementById("form-expediente");
const campoObservaciones = document.getElementById("observaciones-generales");

const botonEditar = document.getElementById("boton-editar-expediente");
const botonCancelar = document.getElementById("boton-cancelar-expediente");
const botonGuardar = document.getElementById("boton-guardar-expediente");

// Guarda el expediente cargado actualmente.
let expedienteActual = null;


// 2. MENSAJES

function mostrarMensaje(elemento, texto, tipo = null) {
    elemento.classList.remove(
        "mensaje-exito",
        "mensaje-advertencia",
        "mensaje-error"
    );

    elemento.textContent = texto;

    if (tipo) {
        elemento.classList.add(`mensaje-${tipo}`);
    }
}


// 3. FUNCIONES AUXILIARES

function mostrarTexto(id, valor) {
    document.getElementById(id).textContent = valor || "No especificado";
}

function formatearFecha(fecha) {
    if (!fecha) return "No disponible";

    const [anio, mes, dia] = fecha.substring(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
}

function descripcionEstado(estado) {
    const estados = {
        DISPONIBLE: "Disponible",
        EN_PROCESO: "En proceso",
        ADOPTADA: "Adoptada",
        INACTIVA: "Inactiva"
    };

    return estados[estado] || estado || "No especificado";
}


// 4. MOSTRAR INFORMACIÓN DE LA MASCOTA

function mostrarMascota(mascota) {

    mostrarTexto("expediente-nombre", mascota.nombre);
    mostrarTexto("expediente-especie", mascota.especie);
    mostrarTexto("expediente-raza", mascota.raza);
    mostrarTexto("expediente-sexo", mascota.sexo);
    mostrarTexto("expediente-tamano", mascota.tamano);

    mostrarTexto(
        "expediente-nacimiento",
        mascota.fechaNacimientoEstimada
            ? formatearFecha(mascota.fechaNacimientoEstimada)
            : null
    );

    document.getElementById("expediente-estado").textContent =
        descripcionEstado(mascota.estado);

    const imagen = document.getElementById("expediente-imagen");
    const alternativa = document.getElementById(
        "expediente-imagen-alternativa"
    );

    imagen.hidden = true;
    alternativa.hidden = true;

    imagen.onerror = () => {
        imagen.hidden = true;
        alternativa.hidden = false;
    };

    if (mascota.imagenPrincipalUrl) {
        imagen.src = new URL(mascota.imagenPrincipalUrl, URL_API).href;
        imagen.hidden = false;
    } else {
        alternativa.hidden = false;
    }

    seccionMascota.hidden = false;
}


// 5. CONSULTAR INFORMACIÓN DESDE LA API

async function consultarJSON(url) {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    return respuesta.json();
}

async function cargarExpediente() {

    // Verificar que se recibió un identificador válido.
    if (!idMascota || !/^[1-9]\d*$/.test(idMascota)) {
        mostrarMensaje(
            mensajeExpediente,
            "No se proporcionó un identificador válido de mascota.",
            "error"
        );
        return;
    }

    mostrarMensaje(mensajeExpediente, "Cargando expediente...");

    try {
        // Consultar los datos de la mascota.
        const mascota = await consultarJSON(
            `${API_MASCOTAS}/${idMascota}`
        );

        mostrarMascota(mascota);

        // Consultar el expediente de la mascota.
        const respuesta = await fetch(
            `${API_EXPEDIENTES}/mascota/${idMascota}`
        );

        if (respuesta.status === 404) {
            // Mascota existente, pero sin expediente.
            expedienteActual = null;
            mostrarFormularioCreacion();

        
        } else if (respuesta.ok) {
            expedienteActual = await respuesta.json();

            mostrarExpedienteExistente(expedienteActual);

            // Consultar los registros del expediente existente.
            await cargarHistorialSeguimiento(
                expedienteActual.idExpediente
            );

        } else {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        seccionExpediente.hidden = false;
        seccionSeguimiento.hidden = false;

        mostrarMensaje(mensajeExpediente, "");

    } catch (error) {
        console.error("Error al cargar expediente:", error);

        mostrarMensaje(
            mensajeExpediente,
            "No fue posible cargar la información de esta mascota.",
            "error"
        );
    }
}


// 6. MOSTRAR FORMULARIO DE CREACIÓN

function mostrarFormularioCreacion() {
    document.getElementById("lista-seguimiento").replaceChildren();
    document.getElementById("estado-vacio-seguimiento").hidden = false;
    document.getElementById("expediente-fecha").textContent =
        "Esta mascota todavía no tiene un expediente.";

    document.getElementById("expediente-observaciones").hidden = true;

    botonEditar.hidden = true;
    botonCancelar.hidden = true;

    campoObservaciones.value = "";
    botonGuardar.textContent = "Crear expediente";
    formularioExpediente.hidden = false;
}


// 7. MOSTRAR EXPEDIENTE EXISTENTE

function mostrarExpedienteExistente(expediente) {
    document.getElementById("expediente-fecha").textContent =
        `Fecha de creación: ${formatearFecha(expediente.fechaCreacion)}`;

    const observaciones = document.getElementById(
        "expediente-observaciones"
    );

    observaciones.textContent =
        expediente.observacionesGenerales || "Sin observaciones registradas.";

    observaciones.hidden = false;

    formularioExpediente.hidden = true;
    botonEditar.hidden = false;
    botonCancelar.hidden = true;
}


// 8. EDITAR OBSERVACIONES

function activarEdicion() {
    if (!expedienteActual) return;

    campoObservaciones.value =
        expedienteActual.observacionesGenerales || "";

    formularioExpediente.hidden = false;
    botonEditar.hidden = true;
    botonCancelar.hidden = false;
    botonGuardar.textContent = "Guardar cambios";

    document.getElementById("expediente-observaciones").hidden = true;

    campoObservaciones.focus();
}

function cancelarEdicion() {
    if (expedienteActual) {
        mostrarExpedienteExistente(expedienteActual);
    }
}


// 9. GUARDAR EXPEDIENTE

async function guardarExpediente(evento) {
    evento.preventDefault();

    const observaciones = campoObservaciones.value.trim();

    // Determinar si se crea o actualiza el expediente.
    const esEdicion = expedienteActual !== null;
    const metodo = esEdicion ? "PUT" : "POST";

    botonGuardar.disabled = true;
    mostrarMensaje(mensajeFormulario, "Guardando expediente...");

    try {
        const respuesta = await fetch(
            `${API_EXPEDIENTES}/mascota/${idMascota}`,
            {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    observacionesGenerales: observaciones
                })
            }
        );

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        expedienteActual = await respuesta.json();
        mostrarExpedienteExistente(expedienteActual);
        // Actualizar el historial cuando se crea un expediente nuevo.
        if (!esEdicion) {
            await cargarHistorialSeguimiento(
                expedienteActual.idExpediente
            );
        }

        mostrarMensaje(
            mensajeFormulario,
            esEdicion
                ? "Las observaciones se actualizaron correctamente."
                : "El expediente se creó correctamente.",
            "exito"
        );

    } catch (error) {
        console.error("Error al guardar el expediente:", error);

        mostrarMensaje(
            mensajeFormulario,
            "No se pudo guardar el expediente. Inténtalo nuevamente.",
            "error"
        );

    } finally {
        botonGuardar.disabled = false;
    }
}

/* =========================================================
   CONSULTAR Y MOSTRAR EL HISTORIAL DE SEGUIMIENTO
========================================================= */

// Consulta los registros asociados a un expediente.
async function cargarHistorialSeguimiento(idExpediente) {

    const lista = document.getElementById("lista-seguimiento");
    const estadoVacio = document.getElementById(
        "estado-vacio-seguimiento"
    );

    lista.replaceChildren();
    estadoVacio.hidden = true;

    try {
        const registros = await consultarJSON(
            `${API_SEGUIMIENTO}/expediente/${idExpediente}`
        );

        if (!Array.isArray(registros)) {
            throw new Error("La respuesta del historial no es válida.");
        }

        // Si no hay registros, mostrar el mensaje correspondiente.
        if (registros.length === 0) {
            estadoVacio.hidden = false;
            return;
        }

        // Crear una tarjeta por cada registro.
        registros.forEach(registro => {

            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-registro-seguimiento";

            const encabezado = document.createElement("div");
            encabezado.className = "encabezado-registro";

            const nombre = document.createElement("h3");
            nombre.textContent = registro.nombre;

            const tipo = document.createElement("span");
            tipo.className = "etiqueta-tipo-registro";
            tipo.textContent = registro.tipo;

            encabezado.append(nombre, tipo);

            const fecha = document.createElement("p");
            fecha.className = "fecha-registro";
            fecha.textContent =
                `Fecha: ${formatearFecha(registro.fechaEvento)}`;

            tarjeta.append(encabezado, fecha);

            // Descripción del evento.
            if (registro.descripcion) {
                const descripcion = document.createElement("p");
                descripcion.textContent = registro.descripcion;
                tarjeta.appendChild(descripcion);
            }

            // Peso registrado, cuando exista.
            if (registro.pesoKg != null) {
                const peso = document.createElement("p");
                peso.textContent = `Peso: ${registro.pesoKg} kg`;
                tarjeta.appendChild(peso);
            }

            // Veterinario responsable.
            if (registro.veterinario) {
                const veterinario = document.createElement("p");
                veterinario.textContent =
                    `Veterinario: ${registro.veterinario}`;
                tarjeta.appendChild(veterinario);
            }

            // Próxima fecha de revisión o aplicación.
            if (registro.proximaFecha) {
                const proximaFecha = document.createElement("p");
                proximaFecha.textContent =
                    `Próxima fecha: ${formatearFecha(registro.proximaFecha)}`;
                tarjeta.appendChild(proximaFecha);
            }

            lista.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al consultar seguimiento:", error);

        lista.replaceChildren();

        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-error";
        mensaje.textContent =
            "No fue posible consultar el historial de seguimiento.";

        lista.appendChild(mensaje);
    }
}


// 10. EVENTOS

botonEditar.addEventListener("click", activarEdicion);
botonCancelar.addEventListener("click", cancelarEdicion);
formularioExpediente.addEventListener("submit", guardarExpediente);

// Cargar la información cuando se abra la página.
cargarExpediente();
