import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";

/**
 * Crea el menú de navegación lateral
 * @param {Object} callbacks - { alHacerClick }
 * @returns {Elemento} Menú de navegación listo para montar
 */
export function crearMenuNavegacion({alHacerClick}) {
    return construirElemento({
        tipo: 'nav',
        atributos: {
            class: 'barra-navegacion-lateral'
        },
        hijos: [
            {
                tipo: 'ul',
                atributos: { class: 'menu-navegacion' },
                hijos: [
                    {
                        tipo: 'li',
                        hijos: [
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#'
                                },
                                eventos: {
                                    click: (e) => {
                                        console.log(e.target);
                                        e.preventDefault();
                                        if (alHacerClick && typeof alHacerClick === 'function') {
                                            alHacerClick(seccionesApp.inicio);
                                        }
                                    }
                                },
                                hijos: ['Inicio']
                            }
                        ]
                    },
                    {
                        tipo: 'li',
                        hijos: [
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alHacerClick && typeof alHacerClick === 'function') {
                                            alHacerClick(seccionesApp.perfil );
                                        }
                                    }
                                },
                                hijos: ['Perfil']
                            }
                        ]
                    },
                    {
                        tipo: 'li',
                        hijos: [
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alHacerClick && typeof alHacerClick === 'function') {
                                            alHacerClick(seccionesApp.bitacora );
                                        }
                                    }
                                },
                                hijos: ['Bitacora']
                            }
                        ]
                    },
                    {
                        tipo: 'li',
                        hijos: [
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alHacerClick && typeof alHacerClick === 'function') {
                                            alHacerClick(seccionesApp.sisco );
                                        }
                                    }
                                },
                                hijos: ['Evaluaciones']
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

