
const API_MASCOTAS = "http://localhost:8080/api/mascotas";

const listaMascotas = document.getElementById("lista-mascotas");
const mensajeCatalogo = document.getElementById("mensaje-catalogo");


async function cargarMascotas(filtros = {}) {
    mensajeCatalogo.textContent = "Cargando mascotas...";
    listaMascotas.replaceChildren();

    try {
        const url = new URL(API_MASCOTAS);

        // Agregar solamente los filtros que tienen valor
        if (filtros.nombre) {
            url.searchParams.set("nombre", filtros.nombre);
        }

        if (filtros.especie) {
            url.searchParams.set("especie", filtros.especie);
        }

        if (filtros.estado) {
            url.searchParams.set("estado", filtros.estado);
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

// Mostrar las mascotas en tarjetas
function mostrarMascotas(mascotas) {
    listaMascotas.replaceChildren();

    if (mascotas.length === 0) {
        mensajeCatalogo.textContent = "No hay mascotas registradas.";
        return;
    }

    mensajeCatalogo.textContent =
        `Se encontraron ${mascotas.length} mascota(s).`;

    mascotas.forEach(mascota => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-mascota";

        const contenido = document.createElement("div");
        contenido.className = "tarjeta-contenido";

        const nombre = document.createElement("h3");
        nombre.textContent = mascota.nombre || "Sin nombre";

        const especie = document.createElement("p");
        especie.textContent = `Especie: ${mascota.especie || "No especificada"}`;

        const raza = document.createElement("p");
        raza.textContent = `Raza: ${mascota.raza || "No especificada"}`;

        const tamano = document.createElement("p");
        tamano.textContent = `Tamaño: ${mascota.tamano || "No especificado"}`;

        const estado = document.createElement("p");
        estado.textContent = `Estado: ${mascota.estado || "No especificado"}`;

         
        contenido.append(nombre, especie, raza, tamano, estado);
        // Crear el botón Editar
        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        // Las mascotas inactivas no pueden modificarse
        if (mascota.estado === "INACTIVA") {
             botonEditar.disabled = true;
             botonEditar.title = "No se puede editar una mascota inactiva";
            } else {
                botonEditar.addEventListener("click", () => {
                    abrirFormularioEdicion(mascota);
                });
            }
            contenido.appendChild(botonEditar);
            // Crear el botón para desactivar la mascota
            const botonDesactivar = document.createElement("button");
            botonDesactivar.type = "button";
            botonDesactivar.textContent = "Desactivar";
            // No permitir desactivar nuevamente una mascota inactiva
            if (mascota.estado === "INACTIVA") {
                botonDesactivar.disabled = true;
                botonDesactivar.title = "Esta mascota ya está inactiva";
            } else {
                botonDesactivar.addEventListener("click", () => {
                     desactivarMascota(mascota);
                    });
                }
                contenido.appendChild(botonDesactivar);
            tarjeta.appendChild(contenido);
            listaMascotas.appendChild(tarjeta);
        });
    }

// Cargar mascotas al abrir la página
document.addEventListener("DOMContentLoaded", cargarMascotas);

const formularioFiltros = document.getElementById("form-filtros");

formularioFiltros.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const filtros = {
        nombre: document.getElementById("buscar-nombre").value.trim(),
        especie: document.getElementById("filtro-especie").value,
        estado: document.getElementById("filtro-estado").value
    };

    cargarMascotas(filtros);
});

// Restablecer los filtros y mostrar todas las mascotas
formularioFiltros.addEventListener("reset", () => {
    cargarMascotas();
});

/* =====================================
   REGISTRAR UNA NUEVA MASCOTA (POST)
===================================== */

const formularioRegistro = document.getElementById("form-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

formularioRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Obtener los datos ingresados en el formulario
    const datosMascota = {
        nombre: document.getElementById("registro-nombre").value.trim(),
        especie: document.getElementById("registro-especie").value,
        raza: document.getElementById("registro-raza").value.trim(),
        sexo: document.getElementById("registro-sexo").value,
        tamano: document.getElementById("registro-tamano").value,
        descripcion: document.getElementById("registro-descripcion").value.trim()
    };

    // Validar los campos obligatorios
    if (!datosMascota.nombre || !datosMascota.especie) {
        mensajeRegistro.textContent =
            "El nombre y la especie son obligatorios.";
        return;
    }

    const botonRegistrar = formularioRegistro.querySelector(
        'button[type="submit"]'
    );

    botonRegistrar.disabled = true;
    mensajeRegistro.textContent = "Registrando mascota...";

    try {
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

        mensajeRegistro.textContent =
            `¡${mascotaRegistrada.nombre} fue registrada correctamente!`;

        console.log("Mascota registrada:", mascotaRegistrada);

        // Limpiar los campos después del registro
        formularioRegistro.reset();

        // Actualizar el catálogo con los nuevos datos
        await cargarMascotas();

    } catch (error) {
        console.error("Error al registrar mascota:", error);

        mensajeRegistro.textContent =
            "No se pudo registrar la mascota. Revisa los datos e inténtalo nuevamente.";
    } finally {
        botonRegistrar.disabled = false;
    }
});

/* =====================================
   ABRIR FORMULARIO DE EDICIÓN
===================================== */

const seccionEdicion = document.getElementById("seccion-edicion");
const formularioEdicion = document.getElementById("form-edicion");
const mensajeEdicion = document.getElementById("mensaje-edicion");

function abrirFormularioEdicion(mascota) {
    document.getElementById("editar-id").value = mascota.idMascota;
    document.getElementById("editar-nombre").value = mascota.nombre || "";
    document.getElementById("editar-especie").value = mascota.especie || "Perro";
    document.getElementById("editar-raza").value = mascota.raza || "";
    document.getElementById("editar-sexo").value = mascota.sexo || "";
    document.getElementById("editar-tamano").value = mascota.tamano || "";
    document.getElementById("editar-descripcion").value =
        mascota.descripcion || "";

    mensajeEdicion.textContent = "";

    // Mostrar el formulario
    seccionEdicion.hidden = false;

    // Desplazarse hasta la sección de edición
    seccionEdicion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Cancelar la edición
document.getElementById("cancelar-edicion").addEventListener("click", () => {
    formularioEdicion.reset();
    seccionEdicion.hidden = true;
    mensajeEdicion.textContent = "";
});

/* =====================================
   ACTUALIZAR MASCOTA (PUT)
===================================== */

formularioEdicion.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Identificar la mascota que estamos editando
    const idMascota = document.getElementById("editar-id").value;

    // Obtener los datos actualizados del formulario
    const datosActualizados = {
        nombre: document.getElementById("editar-nombre").value.trim(),
        especie: document.getElementById("editar-especie").value,
        raza: document.getElementById("editar-raza").value.trim(),
        sexo: document.getElementById("editar-sexo").value,
        tamano: document.getElementById("editar-tamano").value,
        descripcion: document.getElementById("editar-descripcion").value.trim()
    };

    if (!datosActualizados.nombre || !datosActualizados.especie) {
        mensajeEdicion.textContent =
            "El nombre y la especie son obligatorios.";
        return;
    }

    const botonGuardar = formularioEdicion.querySelector(
        'button[type="submit"]'
    );

    botonGuardar.disabled = true;
    mensajeEdicion.textContent = "Guardando cambios...";

    try {
        const respuesta = await fetch(
            `${API_MASCOTAS}/${encodeURIComponent(idMascota)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            }
        );

        if (respuesta.status === 404) {
            throw new Error("La mascota no existe.");
        }

        if (respuesta.status === 409) {
            throw new Error("No se puede editar una mascota inactiva.");
        }

        if (!respuesta.ok) {
            throw new Error(`No se pudo actualizar. HTTP ${respuesta.status}`);
        }

        mensajeEdicion.textContent =
            "¡Mascota actualizada correctamente!";

        // Recargar las tarjetas para mostrar los cambios
        await cargarMascotas();

        console.log("Mascota actualizada:", idMascota);

    } catch (error) {
        console.error("Error al actualizar mascota:", error);
        mensajeEdicion.textContent = error.message;
    } finally {
        botonGuardar.disabled = false;
    }
});

/* =====================================
   DESACTIVAR MASCOTA (DELETE)
===================================== */

async function desactivarMascota(mascota) {

    // Confirmar antes de realizar la operación
    const confirmar = confirm(
        `¿Estás segura de que deseas desactivar a ${mascota.nombre}?`
    );

    if (!confirmar) {
        return;
    }

    try {
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
            throw new Error("No se puede desactivar esta mascota por su estado.");
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        alert(`${mascota.nombre} fue desactivada correctamente.`);

        // Actualizar el catálogo
        await cargarMascotas();

    } catch (error) {
        console.error("Error al desactivar mascota:", error);
        alert(`No se pudo desactivar la mascota: ${error.message}`);
    }
}


