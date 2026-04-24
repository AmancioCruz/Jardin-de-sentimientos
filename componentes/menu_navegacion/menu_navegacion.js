import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";

export function crearMenuNavegacion({ usuario, alHacerClick, alCerrarSesion }) {
    const opciones = [
        { etiqueta: "Inicio", seccion: seccionesApp.inicio, icono: "fa-solid fa-house" },
        { etiqueta: "Mi espacio", seccion: seccionesApp.espacio, icono: "fa-solid fa-id-card" },
        { etiqueta: "Ayuda", seccion: seccionesApp.ayuda, icono: "fa-solid fa-heart" },
        { etiqueta: "Configuración", seccion: seccionesApp.configuracion, icono: "fa-solid fa-gear", clase: "menu-navegacion__item--secundario" }
    ];

    return construirElemento({
        tipo: "nav",
        atributos: {
            class: "barra-navegacion-lateral"
        },
        hijos: [
            {
                tipo: "div",
                atributos: {
                    class: "menu-navegacion__panel",
                    id: "menu-navegacion-panel",
                    "data-menu-panel": ""
                },
                hijos: [
                    {
                        tipo: "section",
                        atributos: { class: "menu-navegacion__superior" },
                        hijos: [
                            crearResumenUsuario(usuario)
                        ]
                    },
                    {
                        tipo: "section",
                        atributos: { class: "menu-navegacion__inferior" },
                        hijos: [
                            {
                                tipo: "ul",
                                atributos: { class: "menu-navegacion" },
                                hijos: opciones.map(({ etiqueta, seccion, icono, clase = "" }) => ({
                                    tipo: "li",
                                    atributos: { class: clase },
                                    hijos: [
                                        {
                                            tipo: "a",
                                            atributos: { href: "#" },
                                            eventos: {
                                                click: (e) => {
                                                    e.preventDefault();
                                                    if (typeof alHacerClick === "function") {
                                                        alHacerClick(seccion);
                                                    }
                                                }
                                            },
                                            hijos: [
                                                { tipo: "i", atributos: { class: icono } },
                                                { tipo: "span", hijos: [etiqueta] }
                                            ]
                                        }
                                    ]
                                }))
                            },
                            {
                                tipo: "button",
                                atributos: {
                                    type: "button",
                                    class: "btn-fantasma btn-pequeno btn-salir-sidebar",
                                    title: "Cerrar sesión"
                                },
                                eventos: {
                                    click: typeof alCerrarSesion === "function" ? alCerrarSesion : null
                                },
                                hijos: [
                                    { tipo: "i", atributos: { class: "fa-solid fa-sign-out-alt" } },
                                    "Cerrar sesión"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

function crearResumenUsuario(usuario = {}) {
    const tieneImagen = Boolean(usuario?.urlImagen);
    const detalleUsuario = usuario?.programa || usuario?.semestre || "Tu recorrido en la app";

    return {
        tipo: "section",
        atributos: { class: "menu-navegacion__resumen" },
        hijos: [
            {
                tipo: "div",
                atributos: { class: "menu-navegacion__avatar" },
                hijos: tieneImagen
                    ? [
                        {
                            tipo: "img",
                            atributos: {
                                src: usuario.urlImagen,
                                alt: `Foto de ${usuario?.nombre || "usuario"}`,
                                class: "menu-navegacion__avatar-imagen"
                            }
                        }
                    ]
                    : [
                        {
                            tipo: "img",
                            atributos: {
                                src: "./recursos/iconos/Icono_Logo.svg",
                                alt: "",
                                class: "menu-navegacion__avatar-imagen menu-navegacion__avatar-imagen--marca"
                            }
                        }
                    ]
            },
            {
                tipo: "div",
                atributos: { class: "menu-navegacion__resumen-texto" },
                hijos: [
                    { tipo: "strong", atributos: { class: "menu-navegacion__nombre" }, hijos: [usuario?.nombre || "Tu espacio"] },
                    { tipo: "span", atributos: { class: "menu-navegacion__detalle" }, hijos: [detalleUsuario] }
                ]
            }
        ]
    };
}
