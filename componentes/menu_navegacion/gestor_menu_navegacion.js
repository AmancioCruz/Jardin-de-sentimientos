import { crearMenuNavegacion } from "./menu_navegacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { CerrarSesionAuth } from "../../servicios/autenticacion.js";
import { limpiarEstado } from "../../nucleo/sistema_estados.js";

export function componenteMenu(usuario) {
    document.querySelectorAll('.barra-navegacion-lateral').forEach((menuExistente) => {
        menuExistente.remove();
    });

    const menu = crearMenuNavegacion({
        alHacerClick: (seccion) => {
            if (document.body.classList.contains('actividad-activa')) {
                const salir = confirm('¿Quieres finalizar esta actividad? Los datos que no hayas guardado se perderán.');
                if (!salir) return;
                window.dispatchEvent(new CustomEvent('actividad:finalizada-sin-guardar'));
            }

            /* Cuando el usuario cambia de seccion limpiamos el modo actividad,
               para que el siguiente modulo entre con el layout normal de la app. */
            contenedores.contenido.classList.remove('actividad-activa');
            document.body.classList.remove('actividad-activa');
            mostrarPantalla(seccion, usuario);
        },
        alCerrarSesion: cerrarSesion
    });

    menu.montar(contenedores.principal);
    if (menu.nodo) {
        contenedores.principal.prepend(menu.nodo);
    }

    contenedores.principal.classList.add('con-menu');
    contenedores.contenido.classList.add('margen-por-barra-navegacion');

    return menu;
}

async function cerrarSesion() {
    try {
        if (document.body.classList.contains('actividad-activa')) {
            const salir = confirm('¿Quieres finalizar esta actividad? Los datos que no hayas guardado se perderán.');
            if (!salir) return;
            window.dispatchEvent(new CustomEvent('actividad:finalizada-sin-guardar'));
        }

        await CerrarSesionAuth();
        limpiarEstado();
        document.querySelector('#contenedor-principal')?.classList.remove('con-menu');
        window.location.reload();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
