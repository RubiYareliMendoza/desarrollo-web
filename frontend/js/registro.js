const API_REGISTRO = "http://localhost:8080/api/usuarios";

const formulario = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje-registro");
const botonEnviar = formulario.querySelector('button[type="submit"]');

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "Creando tu cuenta...";
    botonEnviar.disabled = true;

    const datosUsuario = {
        nombres: document.getElementById("nombres").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        contrasena: document.getElementById("contrasena").value,
        telefono: document.getElementById("telefono").value.trim(),
        direccion: document.getElementById("direccion").value.trim()
    };

    try {
        const respuesta = await fetch(API_REGISTRO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        });

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            throw new Error(
                resultado.detail ||
                resultado.message ||
                "No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo."
            );
        }

        formulario.reset();
        mensaje.textContent =
            "¡Cuenta creada! Ahora puedes iniciar sesión. Te llevaremos al login…";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1800);
    } catch (error) {
        mensaje.textContent =
            error.message || "No se pudo conectar con el servidor.";
    } finally {
        botonEnviar.disabled = false;
    }
});