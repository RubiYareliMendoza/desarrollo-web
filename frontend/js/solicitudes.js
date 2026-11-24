const API_MASCOTAS = "http://localhost:8080/api/mascotas";
const API_SOLICITUDES =
    "http://localhost:8080/api/solicitudes-adopcion";

const usuarioActual = JSON.parse(
    sessionStorage.getItem("usuarioActual") || "null"
);

const mensajeGeneral = document.getElementById("mensaje-general");
const tituloBienvenida =
    document.getElementById("titulo-bienvenida");
const descripcionBienvenida =
    document.getElementById("descripcion-bienvenida");
const seccionAdoptante = document.getElementById("seccion-adoptante");
const seccionAdministrador =
    document.getElementById("seccion-administrador");

document.getElementById("cerrar-sesion").addEventListener("click", () => {
    sessionStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
});

async function consultarAPI(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    const texto = await respuesta.text();
    const datos = texto ? JSON.parse(texto) : null;

    if (!respuesta.ok) {
        throw new Error(
            datos?.detail || datos?.message || `Error HTTP ${respuesta.status}`
        );
    }

    return datos;
}

function crearParrafo(texto) {
    const parrafo = document.createElement("p");
    parrafo.textContent = texto;
    return parrafo;
}

if (!usuarioActual) {
    window.location.href = "login.html";
} else if (usuarioActual.nombreRol === "ADOPTANTE") {
    seccionAdoptante.hidden = false;
    cargarMascotasDisponibles();
    cargarMisSolicitudes();

    document
        .getElementById("form-solicitud")
        .addEventListener("submit", enviarSolicitud);

} else if (usuarioActual.nombreRol === "ADMINISTRADOR") {
    tituloBienvenida.textContent = "Gestión de solicitudes";
    descripcionBienvenida.textContent =
    "Revisa las solicitudes de adopción y ayuda a cada mascota a encontrar un hogar.";
    seccionAdministrador.hidden = false;
    document.getElementById("enlace-usuarios").hidden = false;
    cargarSolicitudesPendientes();
} else {
    sessionStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
}

// Convertir las fechas de MySQL a un formato legible.
function formatearFechaSolicitud(fecha) {
    if (!fecha) return "Fecha no disponible";

    const partes = fecha.substring(0, 10).split("-");

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Crear una etiqueta visual según el estado.
function crearEtiquetaEstado(estado) {
    const etiqueta = document.createElement("span");

    const estadosPermitidos = [
        "PENDIENTE",
        "APROBADA",
        "RECHAZADA"
    ];

    const estadoNormalizado = estadosPermitidos.includes(estado)
        ? estado
        : "OTRO";

    etiqueta.className =
        `etiqueta-estado estado-${estadoNormalizado.toLowerCase()}`;

    const nombres = {
        PENDIENTE: "Pendiente",
        APROBADA: "Aprobada",
        RECHAZADA: "Rechazada",
        OTRO: "Sin especificar"
    };

    etiqueta.textContent = nombres[estadoNormalizado];

    return etiqueta;
}

// Crear un dato con su etiqueta.
function crearDatoSolicitud(etiqueta, valor) {
    const parrafo = document.createElement("p");
    parrafo.className = "dato-solicitud";

    const titulo = document.createElement("strong");
    titulo.textContent = `${etiqueta}: `;

    const contenido = document.createElement("span");
    contenido.textContent = valor || "No especificado";

    parrafo.append(titulo, contenido);

    return parrafo;
}

async function cargarMascotasDisponibles() {
    const selector = document.getElementById("mascota");

    try {
        const mascotas = await consultarAPI(
            `${API_MASCOTAS}?estado=DISPONIBLE`
        );

        selector.replaceChildren();

        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = mascotas.length
            ? "Selecciona una mascota"
            : "No hay mascotas disponibles";
        selector.appendChild(opcionInicial);

        mascotas.forEach((mascota) => {
            const opcion = document.createElement("option");
            opcion.value = mascota.idMascota;
            opcion.textContent =
                `${mascota.nombre} (${mascota.especie})`;
            selector.appendChild(opcion);
        });

        selector.disabled = mascotas.length === 0;
    } catch (error) {
        mensajeGeneral.textContent =
            `No se pudieron cargar las mascotas: ${error.message}`;
    }
}

async function enviarSolicitud(evento) {
    evento.preventDefault();
    mensajeGeneral.textContent = "Enviando solicitud...";

    const datos = {
        idMascota: Number(document.getElementById("mascota").value),
        idAdoptante: usuarioActual.idUsuario,
        mensaje: document
            .getElementById("mensaje-solicitud")
            .value
            .trim()
    };

    try {
        await consultarAPI(API_SOLICITUDES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        mensajeGeneral.textContent =
            "Solicitud enviada. Quedó pendiente de revisión.";
        document.getElementById("form-solicitud").reset();
        await cargarMascotasDisponibles();
        await cargarMisSolicitudes();
    } catch (error) {
        mensajeGeneral.textContent =
            `No se pudo enviar la solicitud: ${error.message}`;
    }
}


async function cargarMisSolicitudes() {

    const contenedor =
        document.getElementById("lista-mis-solicitudes");

    contenedor.replaceChildren(
        crearParrafo("Cargando solicitudes...")
    );

    try {
        const solicitudes = await consultarAPI(
            `${API_SOLICITUDES}/mis-solicitudes?idAdoptante=${usuarioActual.idUsuario}`
        );

        contenedor.replaceChildren();

        if (solicitudes.length === 0) {
            const vacio = crearParrafo(
                "Todavía no tienes solicitudes de adopción."
            );

            vacio.className = "estado-vacio-solicitudes";
            contenedor.appendChild(vacio);
            return;
        }

        solicitudes.forEach((solicitud) => {

            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-solicitud";

            // Encabezado con mascota y estado.
            const encabezado = document.createElement("div");
            encabezado.className = "encabezado-tarjeta-solicitud";

            const nombre = document.createElement("h3");
            nombre.textContent = `🐾 ${solicitud.nombreMascota}`;

            const estado = crearEtiquetaEstado(solicitud.estado);

            encabezado.append(nombre, estado);

            // Fecha de envío.
            const fecha = document.createElement("p");
            fecha.className = "fecha-solicitud";
            fecha.textContent =
                `Solicitud enviada el ${formatearFechaSolicitud(
                    solicitud.fechaSolicitud
                )}`;

            tarjeta.append(encabezado, fecha);

            // Comentario del refugio.
            const comentario = document.createElement("div");
            comentario.className = "comentario-refugio";

            const tituloComentario = document.createElement("h4");
            tituloComentario.textContent = "Comentario del refugio";

            const textoComentario = document.createElement("p");
            textoComentario.textContent =
                solicitud.observacionesRevision ||
                "Tu solicitud está pendiente de revisión.";

            comentario.append(
                tituloComentario,
                textoComentario
            );

            tarjeta.appendChild(comentario);

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        contenedor.replaceChildren(
            crearParrafo(
                `No se pudieron cargar las solicitudes: ${error.message}`
            )
        );
    }
}


async function cargarSolicitudesPendientes() {

    const contenedor =
        document.getElementById("lista-pendientes");

    contenedor.replaceChildren(
        crearParrafo("Cargando solicitudes...")
    );

    try {
        const solicitudes = await consultarAPI(
            `${API_SOLICITUDES}/pendientes?idAdministrador=${usuarioActual.idUsuario}`
        );

        contenedor.replaceChildren();

        if (solicitudes.length === 0) {
            const vacio = crearParrafo(
                "No hay solicitudes pendientes."
            );

            vacio.className = "estado-vacio-solicitudes";
            contenedor.appendChild(vacio);
            return;
        }

        solicitudes.forEach((solicitud) => {

            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-solicitud";

            const encabezado = document.createElement("div");
            encabezado.className = "encabezado-tarjeta-solicitud";

            const titulo = document.createElement("h3");
            titulo.textContent =
                `Solicitud #${solicitud.idSolicitud}: ${solicitud.nombreMascota}`;

            encabezado.append(
                titulo,
                crearEtiquetaEstado("PENDIENTE")
            );

            const datos = document.createElement("div");
            datos.className = "datos-adoptante";

            datos.append(
                crearDatoSolicitud(
                    "Adoptante",
                    solicitud.nombreAdoptante
                ),
                crearDatoSolicitud(
                    "Correo",
                    solicitud.correoAdoptante
                )
            );

            const mensaje = document.createElement("div");
            mensaje.className = "comentario-refugio";

            const tituloMensaje = document.createElement("h4");
            tituloMensaje.textContent = "Mensaje del adoptante";

            const textoMensaje = document.createElement("p");
            textoMensaje.textContent =
                solicitud.mensaje || "Sin mensaje";

            mensaje.append(tituloMensaje, textoMensaje);

            // Acciones administrativas.
            const acciones = document.createElement("div");
            acciones.className = "acciones-revision";

            const aprobar = document.createElement("button");
            aprobar.type = "button";
            aprobar.className = "boton-aprobar";
            aprobar.textContent = "Aprobar";

            aprobar.addEventListener("click", () => {
                revisarSolicitud(
                    solicitud.idSolicitud,
                    "APROBADA"
                );
            });

            const rechazar = document.createElement("button");
            rechazar.type = "button";
            rechazar.className = "boton-rechazar";
            rechazar.textContent = "Rechazar";

            rechazar.addEventListener("click", () => {
                revisarSolicitud(
                    solicitud.idSolicitud,
                    "RECHAZADA"
                );
            });

            acciones.append(aprobar, rechazar);

            tarjeta.append(
                encabezado,
                datos,
                mensaje,
                acciones
            );

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        contenedor.replaceChildren(
            crearParrafo(
                `No se pudieron cargar las solicitudes: ${error.message}`
            )
        );
    }
}

async function revisarSolicitud(idSolicitud, estado) {
    const observacionesRevision =
        window.prompt("Observaciones de la revisión (opcional):");

    if (observacionesRevision === null) {
        return;
    }

    try {
        await consultarAPI(
            `${API_SOLICITUDES}/${idSolicitud}/revision`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idRevisor: usuarioActual.idUsuario,
                    estado,
                    observacionesRevision
                })
            }
        );

        mensajeGeneral.textContent =
            `Solicitud ${estado.toLowerCase()} correctamente.`;
        await cargarSolicitudesPendientes();
    } catch (error) {
        mensajeGeneral.textContent =
            `No se pudo revisar la solicitud: ${error.message}`;
    }
}