import { crearMenuNavegacion } from "./menu_navegacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";

export function componenteMenu(usuario) {
    const menu = crearMenuNavegacion({
        alHacerClick: (seccion) => {
            /* Cuando el usuario cambia de seccion limpiamos el modo actividad,
               para que el siguiente modulo entre con el layout normal de la app. */
            contenedores.contenido.classList.remove('actividad-activa');
            document.body.classList.remove('actividad-activa');
            mostrarPantalla(seccion, usuario);
        }
    });

    menu.montar(contenedores.principal);
    if (menu.nodo) {
        contenedores.principal.prepend(menu.nodo);
    }

    contenedores.principal.classList.add('con-menu');
    contenedores.contenido.classList.add('margen-por-barra-navegacion');

    return menu;
}
