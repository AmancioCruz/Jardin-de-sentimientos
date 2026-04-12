import { construirElemento } from "../../utilidades/constructor_elementos.js";

function crearSeccion(titulo, contenido) {
    return {
        tipo: 'div',
        atributos: { class: 'consentimiento-seccion' },
        hijos: [
            { tipo: 'h3', hijos: [titulo] },
            { tipo: 'p', hijos: [contenido] }
        ]
    };
}

export function crearConsentimiento({ consentimientoData, alAceptar, alCerrar }) {
    const seccionesGeneradas = consentimientoData.secciones.map((sec) =>
        crearSeccion(sec.titulo, sec.contenido)
    );

    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-consentimiento',
            class: 'contenedor-registro consentimiento-contenedor',
        },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'tarjeta-app tarjeta-app--elevada card-consentimiento' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: {
                            class: 'btn-regresar-terminos',
                            type: 'button',
                            'aria-label': 'Regresar'
                        },
                        eventos: {
                            click: (e) => {
                                e.preventDefault();
                                if (alCerrar && typeof alCerrar === 'function') {
                                    alCerrar();
                                }
                            }
                        },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-arrow-left' } },
                            ' Regresar'
                        ]
                    },
                    {
                        tipo: 'h2',
                        atributos: { class: 'consentimiento-titulo' },
                        hijos: [consentimientoData.titulo]
                    },
                    {
                        tipo: 'p',
                        atributos: { class: 'consentimiento-proyecto' },
                        hijos: [consentimientoData.proyecto]
                    },
                    crearSeccion("Datos del proyecto", consentimientoData.datos_proyecto),
                    ...seccionesGeneradas,
                    {
                        tipo: 'div',
                        atributos: { class: 'fila-select' },
                        hijos: [
                            {
                                tipo: 'button',
                                atributos: {
                                    class: 'btn-ancho btn-primario espacio-inferior-m',
                                    type: 'button'
                                },
                                eventos: {
                                    click: async (e) => {
                                        e.preventDefault();
                                        if (alAceptar && typeof alAceptar === 'function') {
                                            await alAceptar();
                                        }
                                    }
                                },
                                hijos: ['Aceptar']
                            }
                        ]
                    }
                ]
            }
        ]
    });
}
