import { crearMenuNavegacion } from "./menu_navegacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";


export function componenteMenu(usuario) {
    const menu = crearMenuNavegacion({
        alHacerClick: (seccion) => {
            console.log(seccion);
            mostrarPantalla(seccion, usuario);
        }
    });

    menu.montar(contenedores.principal);
    contenedores.contenido.classList.add('margen-por-barra-navegacion');

    return menu;
}
