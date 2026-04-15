import { crearInicioSesion } from "./inicio_sesion.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { actualizarSeccion, actualizarSesion, seccionesApp } from "../../../nucleo/sistema_estados.js";
import { IniciarSesionAuth } from "../../../servicios/autenticacion.js";
import { componenteMenu } from "../../../componentes/menu_navegacion/gestor_menu_navegacion.js";
import { componenteInformacionUsuario } from "../../../componentes/informacion_usuario/gestor_informacion_usuario.js";
import { construirUsuario } from "../../../servicios/observador_sesiones.js";
import { componenteTerminos } from "../../../componentes/terminos/gestor_terminos.js";
import { aplicarTemaLocal } from "../../../servicios/preferencias_locales.js";

async function manejarInicioSesion(datos) {
    try {
        const usuario = await IniciarSesionAuth(datos.correo, datos.contrasena);
        const usuarioActual = await construirUsuario(usuario);

        aplicarTemaLocal();
        actualizarSeccion(seccionesApp.inicio);
        actualizarSesion(true);
        componenteMenu(usuarioActual);
        componenteInformacionUsuario(usuarioActual.nombre);
        mostrarPantalla(seccionesApp.inicio, usuarioActual);
    } catch (error) {
        console.error("Error al iniciar sesion:", error);
        throw new Error("No fue posible iniciar sesión. Revisa tu correo y contraseña.");
    }
}

registrarPantalla(seccionesApp.inicioSesion, {
    constructor: crearInicioSesion,
    dependencias: {
        alEnviar: manejarInicioSesion,
        alIrARegistro: () => {
            componenteTerminos({
                alAceptar: () => mostrarPantalla(seccionesApp.registro),
                alCerrar: () => mostrarPantalla(seccionesApp.inicioSesion)
            });
        }
    }
});
