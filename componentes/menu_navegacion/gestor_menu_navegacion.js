import { crearMenuNavegacion } from "./menu_navegacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { cerrarSesionApp, confirmarSalidaActividad } from "../../servicios/sesion.js";
import { activarOverlay, desactivarOverlay } from "../../servicios/overlay.js";

export function componenteMenu(usuario) {
    document.querySelectorAll(".barra-navegacion-lateral").forEach((menuExistente) => {
        menuExistente.__menuController?.abort?.();
        menuExistente.remove();
    });

    const menu = crearMenuNavegacion({
        usuario,
        alHacerClick: (seccion) => {
            if (!confirmarSalidaActividad()) return;

            contenedores.contenido.classList.remove("actividad-activa");
            document.body.classList.remove("actividad-activa");
            mostrarPantalla(seccion, usuario);
        },
        alCerrarSesion: cerrarSesionApp
    });

    menu.montar(contenedores.principal);
    if (menu.nodo) {
        contenedores.principal.prepend(menu.nodo);
        configurarMenu(menu.nodo);
    }

    contenedores.principal.classList.add("con-menu");
    contenedores.principal.classList.remove("menu-colapsado");
    contenedores.contenido.classList.add("margen-por-barra-navegacion");
    configurarCabecera({ conSesion: true, usuario });
    configurarLogoInicio(usuario);

    return menu;
}

function configurarMenu(menu) {
    const botonToggle = contenedores.cabecera?.querySelector("[data-app-menu-toggle]");
    const panel = menu.querySelector("[data-menu-panel]");

    if (!botonToggle || !panel) return;

    const controller = new AbortController();
    const { signal } = controller;

    const cerrarMenu = () => {
        menu.classList.remove("menu-abierto");
        desactivarOverlay("menu-movil");
        if (window.innerWidth >= 1200) {
            contenedores.principal.classList.add("menu-colapsado");
        }
        botonToggle.setAttribute("aria-expanded", "false");
    };

    const abrirMenu = () => {
        if (window.innerWidth >= 1200) {
            contenedores.principal.classList.remove("menu-colapsado");
        } else {
            menu.classList.add("menu-abierto");
            activarOverlay("menu-movil", {
                usarBackdrop: true,
                zIndex: 90,
                alClickBackdrop: cerrarMenu
            });
        }
        botonToggle.setAttribute("aria-expanded", "true");
    };

    botonToggle.addEventListener("click", () => {
        const abierto = window.innerWidth >= 1200
            ? !contenedores.principal.classList.contains("menu-colapsado")
            : menu.classList.contains("menu-abierto");

        if (abierto) {
            cerrarMenu();
            return;
        }

        abrirMenu();
    }, { signal });

    panel.addEventListener("click", (evento) => {
        const objetivo = evento.target.closest("a, button");
        if (!objetivo) return;

        if (window.innerWidth < 1200) {
            cerrarMenu();
        }
    }, { signal });

    document.addEventListener("click", (evento) => {
        if (window.innerWidth >= 1200) return;
        if (menu.contains(evento.target)) return;
        if (contenedores.cabecera?.contains(evento.target)) return;
        cerrarMenu();
    }, { signal });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1200) {
            menu.classList.remove("menu-abierto");
            contenedores.principal.classList.remove("menu-colapsado");
            desactivarOverlay("menu-movil");
            botonToggle.setAttribute("aria-expanded", "true");
            return;
        }

        contenedores.principal.classList.remove("menu-colapsado");
        if (!menu.classList.contains("menu-abierto")) {
            desactivarOverlay("menu-movil");
        }
        botonToggle.setAttribute("aria-expanded", menu.classList.contains("menu-abierto") ? "true" : "false");
    }, { signal });

    if (window.innerWidth >= 1200) {
        botonToggle.setAttribute("aria-expanded", "true");
    }

    menu.__menuController = controller;
}

function configurarLogoInicio(usuario) {
    const logo = contenedores.cabecera.querySelector(".logo");
    if (!logo) return;

    logo.setAttribute("role", "button");
    logo.setAttribute("tabindex", "0");
    logo.setAttribute("title", "Ir al inicio");

    const irAInicio = () => {
        if (!confirmarSalidaActividad()) return;

        contenedores.contenido.classList.remove("actividad-activa");
        document.body.classList.remove("actividad-activa");
        mostrarPantalla(seccionesApp.inicio, usuario);
    };

    logo.onclick = irAInicio;
    logo.onkeydown = (evento) => {
        if (evento.key !== "Enter" && evento.key !== " ") return;

        evento.preventDefault();
        irAInicio();
    };
}

export function configurarCabecera({ conSesion, usuario } = {}) {
    const cabecera = contenedores.cabecera;
    if (!cabecera) return;

    const botonMenu = cabecera.querySelector("[data-app-menu-toggle]");
    const logo = cabecera.querySelector(".logo");

    cabecera.classList.toggle("cabecera-principal--con-sesion", Boolean(conSesion));
    cabecera.classList.toggle("cabecera-principal--sin-sesion", !conSesion);

    if (botonMenu) {
        botonMenu.hidden = !conSesion;
        botonMenu.setAttribute("aria-expanded", conSesion && window.innerWidth >= 1200 ? "true" : "false");
    }

    if (!conSesion) {
        logo?.removeAttribute("role");
        logo?.removeAttribute("tabindex");
        logo?.removeAttribute("title");
        if (logo) {
            logo.onclick = null;
            logo.onkeydown = null;
        }
        return;
    }

    configurarLogoInicio(usuario);
}
