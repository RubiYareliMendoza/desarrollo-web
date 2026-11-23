const API_MASCOTAS = "http://localhost:8080/api/mascotas";
const API_SOLICITUDES =
    "http://localhost:8080/api/solicitudes-adopcion";

const usuarioActual = JSON.parse(
    sessionStorage.getItem("usuarioActual") || "null"
);

const mensajeGeneral = document.getElementById("mensaje-general");
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

    document.getElementById("enlace-mis-solicitudes").hidden = false;
} else if (usuarioActual.nombreRol === "ADMINISTRADOR") {
    seccionAdministrador.hidden = false;
    document.getElementById("enlace-usuarios").hidden = false;
    cargarSolicitudesPendientes();
} else {
    sessionStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
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
            contenedor.appendChild(
                crearParrafo("Todavía no tienes solicitudes.")
            );
            return;
        }

        solicitudes.forEach((solicitud) => {
            const tarjeta = document.createElement("article");
            const titulo = document.createElement("h3");
            titulo.textContent = solicitud.nombreMascota;
            tarjeta.append(
                titulo,
                crearParrafo(`Estado: ${solicitud.estado}`),
                crearParrafo(`Fecha: ${solicitud.fechaSolicitud}`),
                crearParrafo(
                    solicitud.observacionesRevision || "Sin observaciones"
                )
            );
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        contenedor.replaceChildren(
            crearParrafo(`No se pudieron cargar: ${error.message}`)
        );
    }
}

async function cargarSolicitudesPendientes() {
    const contenedor = document.getElementById("lista-pendientes");
    contenedor.replaceChildren(crearParrafo("Cargando solicitudes..."));

    try {
        const solicitudes = await consultarAPI(
            `${API_SOLICITUDES}/pendientes?idAdministrador=${usuarioActual.idUsuario}`
        );

        contenedor.replaceChildren();

        if (solicitudes.length === 0) {
            contenedor.appendChild(
                crearParrafo("No hay solicitudes pendientes.")
            );
            return;
        }

        solicitudes.forEach((solicitud) => {
            const tarjeta = document.createElement("article");
            const titulo = document.createElement("h3");
            titulo.textContent =
                `Solicitud #${solicitud.idSolicitud}: ${solicitud.nombreMascota}`;

            tarjeta.append(
                titulo,
                crearParrafo(`Adoptante: ${solicitud.nombreAdoptante}`),
                crearParrafo(`Correo: ${solicitud.correoAdoptante}`),
                crearParrafo(`Mensaje: ${solicitud.mensaje || "Sin mensaje"}`)
            );

            const aprobar = document.createElement("button");
            aprobar.type = "button";
            aprobar.textContent = "Aprobar";
            aprobar.addEventListener("click", () =>
                revisarSolicitud(solicitud.idSolicitud, "APROBADA")
            );

            const rechazar = document.createElement("button");
            rechazar.type = "button";
            rechazar.textContent = "Rechazar";
            rechazar.addEventListener("click", () =>
                revisarSolicitud(solicitud.idSolicitud, "RECHAZADA")
            );

            tarjeta.append(aprobar, rechazar);
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        contenedor.replaceChildren(
            crearParrafo(`No se pudieron cargar: ${error.message}`)
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