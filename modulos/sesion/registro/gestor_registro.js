import { crearRegistro } from "./registro.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { actualizarSeccion, actualizarSesion, seccionesApp } from "../../../nucleo/sistema_estados.js";
import { registrarUsuario } from "../../../servicios/coordinador_servicios.js";
import { componenteTerminos } from "../../../componentes/terminos/gestor_terminos.js";
import { componenteMenu } from "../../../componentes/menu_navegacion/gestor_menu_navegacion.js";
import { componenteInformacionUsuario } from "../../../componentes/informacion_usuario/gestor_informacion_usuario.js";
import { construirUsuario } from "../../../servicios/observador_sesiones.js";
import { aplicarTemaLocal } from "../../../servicios/preferencias_locales.js";

async function completarRegistro(datos) {
    if (!datos.foto || datos.foto.size === 0) {
        datos.foto = await crearArchivoPorDefecto();
    }

    const usuarioFirebase = await registrarUsuario(datos);
    const usuarioActual = await construirUsuario(usuarioFirebase);

    aplicarTemaLocal();
    actualizarSeccion(seccionesApp.inicio);
    actualizarSesion(true);
    componenteMenu(usuarioActual);
    componenteInformacionUsuario(usuarioActual.nombre);
    mostrarPantalla(seccionesApp.inicio, usuarioActual);
}

function manejarRegistro(datos) {
    return completarRegistro(datos);
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
        mostrarErrorCampoRegistro('foto-perfil', 'La imagen debe ser PNG, JPG o WEBP. Puedes continuar sin foto.');
        e.target.value = '';
    }
}

function mostrarErrorCampoRegistro(campo, mensaje) {
    const formulario = document.querySelector('#form-registro');
    const control = formulario?.querySelector(`[name="${campo}"]`);
    const contenedorCampo = control?.closest('.campo-registro');

    if (!formulario || !control || !contenedorCampo) return;

    const idError = `error-${campo}`;
    let mensajeCampo = contenedorCampo.querySelector(`#${idError}`);

    if (!mensajeCampo) {
        mensajeCampo = document.createElement('p');
        mensajeCampo.id = idError;
        mensajeCampo.className = 'mensaje-error-campo';
        contenedorCampo.appendChild(mensajeCampo);
    }

    mensajeCampo.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i><span>${mensaje}</span>`;
    contenedorCampo.classList.add('campo-registro--error');
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', idError);
}

async function crearArchivoPorDefecto() {
    const respuesta = await fetch('./recursos/imagenes/default.webp');

    if (!respuesta.ok) {
        throw new Error('No se pudo preparar la foto de perfil por defecto.');
    }

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
