const API_URL = "http://localhost:8080/api/usuarios";

const formularioFiltros = document.getElementById("form-filtros");
const filtroActivo = document.getElementById("filtro-activo");
const filtroRol = document.getElementById("filtro-rol");
const mensajeListado = document.getElementById("mensaje-listado");
const listaUsuarios = document.getElementById("lista-usuarios");

const formularioRegistro = document.getElementById("form-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

const seccionEdicion = document.getElementById("seccion-edicion");
const formularioEdicion = document.getElementById("form-edicion");
const mensajeEdicion = document.getElementById("mensaje-edicion");
const botonCancelarEdicion = document.getElementById("cancelar-edicion");

let usuariosActuales = [];

async function obtenerMensajeError(respuesta) {
    try {
        const datos = await respuesta.json();
        return datos.detail || datos.message || datos.error ||
            `Error HTTP ${respuesta.status}`;
    } catch {
        return `Error HTTP ${respuesta.status}`;
    }
}

function agregarCelda(fila, valor) {
    const celda = document.createElement("td");
    celda.textContent = valor ?? "—";
    fila.appendChild(celda);
}

async function cargarUsuarios() {
    mensajeListado.textContent = "Cargando usuarios...";
    listaUsuarios.replaceChildren();

    const parametros = new URLSearchParams();

    if (filtroActivo.value !== "") {
        parametros.set("activo", filtroActivo.value);
    }

    if (filtroRol.value !== "") {
        parametros.set("rol", filtroRol.value);
    }

    const url = parametros.toString()
        ? `${API_URL}?${parametros.toString()}`
        : API_URL;

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(await obtenerMensajeError(respuesta));
        }

        usuariosActuales = await respuesta.json();
        listaUsuarios.replaceChildren();

        if (usuariosActuales.length === 0) {
            mensajeListado.textContent = "No se encontraron usuarios.";
            return;
        }

        mensajeListado.textContent =
            `Se encontraron ${usuariosActuales.length} usuario(s).`;

        usuariosActuales.forEach((usuario) => {
            const fila = document.createElement("tr");

            agregarCelda(fila, usuario.idUsuario);
            agregarCelda(
                fila,
                `${usuario.nombres} ${usuario.apellidos}`
            );
            agregarCelda(fila, usuario.correo);
            agregarCelda(fila, usuario.nombreRol);
            agregarCelda(fila, usuario.telefono);
            agregarCelda(
                fila,
                usuario.activo ? "Activo" : "Inactivo"
            );

            const celdaAcciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.textContent = "Editar";
            botonEditar.dataset.accion = "editar";
            botonEditar.dataset.id = usuario.idUsuario;

            const botonDesactivar = document.createElement("button");
            botonDesactivar.type = "button";
            botonDesactivar.textContent =
                usuario.activo ? "Desactivar" : "Inactivo";
            botonDesactivar.dataset.accion = "desactivar";
            botonDesactivar.dataset.id = usuario.idUsuario;
            botonDesactivar.disabled = !usuario.activo;

            celdaAcciones.append(botonEditar, botonDesactivar);
            fila.appendChild(celdaAcciones);
            listaUsuarios.appendChild(fila);
        });
    } catch (error) {
        mensajeListado.textContent =
            `No se pudieron cargar los usuarios: ${error.message}`;
    }
}

formularioFiltros.addEventListener("submit", (evento) => {
    evento.preventDefault();
    cargarUsuarios();
});

formularioFiltros.addEventListener("reset", () => {
    setTimeout(cargarUsuarios, 0);
});

formularioRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensajeRegistro.textContent = "Registrando usuario...";

    const datos = {
        nombres: document.getElementById("registro-nombres").value.trim(),
        apellidos: document.getElementById("registro-apellidos").value.trim(),
        correo: document.getElementById("registro-correo").value.trim(),
        contrasena: document.getElementById("registro-contrasena").value,
        telefono: document.getElementById("registro-telefono").value.trim(),
        direccion: document.getElementById("registro-direccion").value.trim()
    };

    if (datos.contrasena.length < 8) {
        mensajeRegistro.textContent =
            "La contraseña debe tener al menos 8 caracteres.";
        return;
    }

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(await obtenerMensajeError(respuesta));
        }

        mensajeRegistro.textContent = "Usuario registrado correctamente.";
        formularioRegistro.reset();
        formularioFiltros.reset();
    } catch (error) {
        mensajeRegistro.textContent =
            `No se pudo registrar el usuario: ${error.message}`;
    }

    cargarUsuarios();
});

listaUsuarios.addEventListener("click", async (evento) => {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) return;

    const id = Number(boton.dataset.id);
    const usuario = usuariosActuales.find(
        (elemento) => elemento.idUsuario === id
    );

    if (boton.dataset.accion === "editar" && usuario) {
        document.getElementById("editar-id").value = usuario.idUsuario;
        document.getElementById("editar-nombres").value = usuario.nombres;
        document.getElementById("editar-apellidos").value = usuario.apellidos;
        document.getElementById("editar-telefono").value =
            usuario.telefono ?? "";
        document.getElementById("editar-direccion").value =
            usuario.direccion ?? "";

        mensajeEdicion.textContent = "";
        seccionEdicion.hidden = false;
        seccionEdicion.scrollIntoView({ behavior: "smooth" });
    }

    if (boton.dataset.accion === "desactivar" && usuario) {
        const confirmar = confirm(
            `¿Deseas desactivar la cuenta de ${usuario.nombres}?`
        );

        if (!confirmar) return;

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!respuesta.ok) {
                throw new Error(await obtenerMensajeError(respuesta));
            }

            mensajeListado.textContent =
                "Usuario desactivado correctamente.";
            cargarUsuarios();
        } catch (error) {
            mensajeListado.textContent =
                `No se pudo desactivar el usuario: ${error.message}`;
        }
    }
});

formularioEdicion.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensajeEdicion.textContent = "Guardando cambios...";

    const id = document.getElementById("editar-id").value;

    const datos = {
        nombres: document.getElementById("editar-nombres").value.trim(),
        apellidos: document.getElementById("editar-apellidos").value.trim(),
        telefono: document.getElementById("editar-telefono").value.trim(),
        direccion: document.getElementById("editar-direccion").value.trim()
    };

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(await obtenerMensajeError(respuesta));
        }

        mensajeEdicion.textContent = "Cambios guardados correctamente.";
        cargarUsuarios();
    } catch (error) {
        mensajeEdicion.textContent =
            `No se pudieron guardar los cambios: ${error.message}`;
    }
});

botonCancelarEdicion.addEventListener("click", () => {
    formularioEdicion.reset();
    mensajeEdicion.textContent = "";
    seccionEdicion.hidden = true;
});

cargarUsuarios();