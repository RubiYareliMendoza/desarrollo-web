/* =====================================================
   PAWMATCH - NAVEGACIÓN COMPARTIDA
===================================================== */

(() => {
    let usuario = null;

    try {
        usuario = JSON.parse(
            sessionStorage.getItem("usuarioActual") || "null"
        );
    } catch (error) {
        console.error("Error al leer la sesión:", error);
    }

    const esAdmin = usuario?.nombreRol === "ADMINISTRADOR";
    const esAdoptante = usuario?.nombreRol === "ADOPTANTE";

    const enlaceSolicitudes =
        document.getElementById("link-mis-solicitudes");

    const enlaceUsuarios =
        document.getElementById("enlace-usuarios");

    const botonCerrar =
        document.getElementById("cerrar-sesion");

    // Mostrar las opciones correspondientes al rol.
    if (enlaceSolicitudes) {
        enlaceSolicitudes.hidden = !(esAdmin || esAdoptante);
        enlaceSolicitudes.textContent = esAdmin
            ? "Solicitudes"
            : "Mis solicitudes";
    }

    if (enlaceUsuarios) {
        enlaceUsuarios.hidden = !esAdmin;
    }
   
    // Identificar la página actual.
    const paginaActual =
        window.location.pathname.split("/").pop();

    // Primero quitar cualquier estado activo anterior.
    document.querySelectorAll(".nav-unificada a").forEach(enlace => {
        enlace.classList.remove("nav-activo");
        enlace.removeAttribute("aria-current");
    });

    // Resaltar únicamente la página actual.
    document.querySelectorAll(".nav-unificada a").forEach(enlace => {

        const destino = enlace.getAttribute("href");

        if (destino === paginaActual) {
            enlace.classList.add("nav-activo");
            enlace.setAttribute("aria-current", "page");
        }
    });

    // Solicitudes ya tiene su propio evento para cerrar sesión.
    // Evitamos registrar dos manejadores para ese botón.
    if (botonCerrar && paginaActual !== "solicitudes.html") {
        botonCerrar.addEventListener("click", () => {
            sessionStorage.removeItem("usuarioActual");
            window.location.href = "login.html";
        });
    }
})();
