import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";

export function crearMenuNavegacion({ alHacerClick }) {
    /* El menu concentra las rutas principales que ya existen en la app.
       Cada opcion delega la navegacion al callback para no acoplar este componente al gestor. */
    const opciones = [
        { etiqueta: "Inicio", seccion: seccionesApp.inicio },
        { etiqueta: "Perfil", seccion: seccionesApp.perfil },
        { etiqueta: "Bitácora", seccion: seccionesApp.bitacora }
    ];

    return construirElemento({
        tipo: 'nav',
        atributos: {
            class: 'barra-navegacion-lateral'
        },
        hijos: [
            {
                tipo: 'ul',
                atributos: { class: 'menu-navegacion' },
                hijos: opciones.map(({ etiqueta, seccion }) => ({
                    tipo: 'li',
                    hijos: [
                        {
                            tipo: 'a',
                            atributos: { href: '#' },
                            eventos: {
                                click: (e) => {
                                    e.preventDefault();
                                    if (alHacerClick && typeof alHacerClick === 'function') {
                                        alHacerClick(seccion);
                                    }
                                }
                            },
                            hijos: [etiqueta]
                        }
                    ]
                }))
            }
        ]
    });
}
