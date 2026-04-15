import { crearInformacionUsuario } from "./informacion_usuario.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { cerrarSesionApp } from "../../servicios/sesion.js";

export function componenteInformacionUsuario(nombre_usuario = null) {
    contenedores.cabecera.querySelectorAll('.info-usuario').forEach((infoExistente) => {
        infoExistente.remove();
    });

    const informacionUsuario = crearInformacionUsuario({
        nombre_usuario,
        cerrarSesion: cerrarSesionApp
    });

    informacionUsuario.montar(contenedores.cabecera, false);

    return informacionUsuario;
}
