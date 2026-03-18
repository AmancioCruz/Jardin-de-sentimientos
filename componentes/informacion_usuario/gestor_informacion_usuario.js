import { crearInformacionUsuario } from "./informacion_usuario.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { CerrarSesionAuth } from "../../servicios/autenticacion.js";
import { limpiarEstado } from "../../nucleo/sistema_estados.js";

export function componenteInformacionUsuario(nombre_usuario = null) {
    const informacionUsuario = crearInformacionUsuario({
        nombre_usuario: nombre_usuario,
        cerrarSesion: cerrarSesion
    });

    informacionUsuario.montar(contenedores.cabecera, false);

    return informacionUsuario;
}

async function cerrarSesion() {
    try {
        await CerrarSesionAuth();
        limpiarEstado();

        window.location.reload();

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}