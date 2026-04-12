import { crearRegistro } from "./registro.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../../nucleo/sistema_estados.js";
import { registrarUsuario } from "../../../servicios/coordinador_servicios.js";
import { componenteTerminos } from "../../../componentes/terminos/gestor_terminos.js";

async function completarRegistro(datos) {
    /* Si el usuario no sube una foto valida, usamos la imagen por defecto
       para mantener completo el perfil desde el primer acceso. */
    if (!datos.foto ||
        datos.foto.size === 0 ||
        (datos.foto.type !== "image/png" &&
        datos.foto.type !== "image/jpeg" &&
        datos.foto.type !== "image/webp")) {
        datos.foto = await crearArchivoPorDefecto();
    }

    await registrarUsuario(datos);
    alert('Cuenta creada correctamente. Ahora puedes iniciar sesion.');
    mostrarPantalla(seccionesApp.inicioSesion);
}

function manejarRegistro(datos) {
    completarRegistro(datos).catch((error) => {
        console.error("Error en registro:", error);
        alert('No fue posible crear la cuenta. Verifica los datos e intentalo de nuevo.');
        mostrarPantalla(seccionesApp.registro);
    });
}

function manejarTerminos() {
    componenteTerminos({
        alCerrar: () => mostrarPantalla(seccionesApp.registro)
    });
}

function manejarFotografia(e) {
    const imagen = e.target.files[0];
    if (!imagen) {
        return;
    }

    if (imagen.type === "image/png" ||
        imagen.type === "image/jpeg" ||
        imagen.type === "image/webp") {
        const lector = new FileReader();
        lector.onload = (dato) => {
            const url = dato.target.result;
            document.querySelector('#imagen-seleccionada').src = url;
        };
        lector.readAsDataURL(imagen);
    } else {
        alert('La imagen debe ser png, webp o jpg');
    }
}

async function crearArchivoPorDefecto() {
    const respuesta = await fetch('./recursos/imagenes/default.webp');
    const blob = await respuesta.blob();

    return new File([blob], 'default_perfil.webp', {
        type: blob.type || 'image/webp'
    });
}

registrarPantalla(seccionesApp.registro, {
    constructor: crearRegistro,
    dependencias: {
        alEnviar: (datos) => manejarRegistro(datos),
        alVerTerminos: manejarTerminos,
        alIrAInicioSesion: () => mostrarPantalla(seccionesApp.inicioSesion),
        eventoFoto: (e) => manejarFotografia(e)
    }
});
