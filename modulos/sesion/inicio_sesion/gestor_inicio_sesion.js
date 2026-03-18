import { crearInicioSesion } from "./inicio_sesion.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { actualizarSeccion, actualizarSesion, seccionesApp } from "../../../nucleo/sistema_estados.js";
import { IniciarSesionAuth } from "../../../servicios/autenticacion.js";
import { componenteMenu } from "../../../componentes/menu_navegacion/gestor_menu_navegacion.js";
import { componenteInformacionUsuario } from "../../../componentes/informacion_usuario/gestor_informacion_usuario.js";
import { construirUsuario } from "../../../servicios/observador_sesiones.js";


async function manejarInicioSesion(datos) {
    console.log(datos);
    const usuario = await IniciarSesionAuth(datos.correo, datos.contraseña);
    const usuarioActual = await construirUsuario(usuario);
    console.log(usuarioActual);

    actualizarSeccion(seccionesApp.inicio);
    actualizarSesion(true);
    componenteMenu(usuarioActual);
    componenteInformacionUsuario(usuarioActual.nombre);
    mostrarPantalla(seccionesApp.inicio, usuarioActual);
}

function manejarRecuperacion() {

}

registrarPantalla(seccionesApp.inicioSesion, {
    constructor: crearInicioSesion,
    dependencias: {
        alEnviar: manejarInicioSesion,
        alOlvideContrasena: manejarRecuperacion,
        alIrARegistro: () => { mostrarPantalla(seccionesApp.registro) }
    }
})
