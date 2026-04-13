import { crearInicioSesion } from "./inicio_sesion.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { actualizarSeccion, actualizarSesion, seccionesApp } from "../../../nucleo/sistema_estados.js";
import { IniciarSesionAuth } from "../../../servicios/autenticacion.js";
import { componenteMenu } from "../../../componentes/menu_navegacion/gestor_menu_navegacion.js";
import { componenteInformacionUsuario } from "../../../componentes/informacion_usuario/gestor_informacion_usuario.js";
import { construirUsuario } from "../../../servicios/observador_sesiones.js";
import { componenteTerminos } from "../../../componentes/terminos/gestor_terminos.js";

async function manejarInicioSesion(datos) {
    try {
        /* El login arma primero el usuario autenticado de Firebase
           y despues completa la informacion visible que usa la app. */
        const usuario = await IniciarSesionAuth(datos.correo, datos.contrasena);
        const usuarioActual = await construirUsuario(usuario);

        actualizarSeccion(seccionesApp.inicio);
        actualizarSesion(true);
        componenteMenu(usuarioActual);
        componenteInformacionUsuario(usuarioActual.nombre);
        mostrarPantalla(seccionesApp.inicio, usuarioActual);
    } catch (error) {
        console.error("Error al iniciar sesion:", error);
        throw new Error("No fue posible iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.");
    }
}

function manejarRecuperacion() {
}

registrarPantalla(seccionesApp.inicioSesion, {
    constructor: crearInicioSesion,
    dependencias: {
        alEnviar: manejarInicioSesion,
        alOlvideContrasena: manejarRecuperacion,
        alIrARegistro: () => {
            /* Antes de abrir registro mostramos los terminos.
               Cuando el usuario acepta, recien entonces entra al formulario. */
            componenteTerminos({
                alAceptar: () => mostrarPantalla(seccionesApp.registro),
                alCerrar: () => mostrarPantalla(seccionesApp.inicioSesion)
            });
        }
    }
});
