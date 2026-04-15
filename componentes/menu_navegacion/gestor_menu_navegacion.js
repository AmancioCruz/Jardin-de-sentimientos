import { crearMenuNavegacion } from "./menu_navegacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { cerrarSesionApp, confirmarSalidaActividad } from "../../servicios/sesion.js";

export function componenteMenu(usuario) {
    document.querySelectorAll('.barra-navegacion-lateral').forEach((menuExistente) => {
        menuExistente.remove();
    });

    const menu = crearMenuNavegacion({
        alHacerClick: (seccion) => {
            if (!confirmarSalidaActividad()) return;

            contenedores.contenido.classList.remove('actividad-activa');
            document.body.classList.remove('actividad-activa');
            mostrarPantalla(seccion, usuario);
        },
        alCerrarSesion: cerrarSesionApp
    });

    menu.montar(contenedores.principal);
    if (menu.nodo) {
        contenedores.principal.prepend(menu.nodo);
    }

    contenedores.principal.classList.add('con-menu');
    contenedores.contenido.classList.add('margen-por-barra-navegacion');

    return menu;
}
