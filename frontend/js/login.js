const API_LOGIN = "http://localhost:8080/api/auth/login";

const formulario = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje-login");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "Validando datos...";

    const credenciales = {
        correo: document.getElementById("correo").value.trim(),
        contrasena: document.getElementById("contrasena").value
    };

    try {
        const respuesta = await fetch(API_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credenciales)
        });

        const usuario = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                usuario.detail || "Correo o contraseña incorrectos."
            );
        }

        if (
            usuario.nombreRol !== "ADOPTANTE" &&
            usuario.nombreRol !== "ADMINISTRADOR"
        ) {
            throw new Error("La cuenta no tiene un rol reconocido.");
        }

        // Guardamos solo los datos necesarios; nunca la contraseña.
        sessionStorage.setItem("usuarioActual", JSON.stringify({
            idUsuario: usuario.idUsuario,
            nombreRol: usuario.nombreRol,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo
        }));

       if (usuario.nombreRol === "ADMINISTRADOR") {
    window.location.href = "solicitudes.html";
} else {
    window.location.href = "mascotas.html";
}
        
    } catch (error) {
        mensaje.textContent =
            error.message || "No se pudo conectar con el servidor.";
    }
});