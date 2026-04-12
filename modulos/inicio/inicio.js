import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function crearInicio({ callbacks, usuario }) {
    const { alSeleccionarEstado, alNoEstoySeguro } = callbacks || {};

    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-inicio',
            class: 'inicio-contenedor'
        },
        hijos: [
            {
                tipo: 'h1',
                atributos: { class: 'titulo-pantalla inicio-titulo' },
                hijos: [`Hola ${usuario.nombre}`]
            },
            {
                tipo: 'section',
                atributos: { class: 'inicio-eleccion' },
                hijos: [
                    {
                        tipo: 'h2',
                        atributos: { class: 'inicio-subtitulo' },
                        hijos: ['¿Cómo te sientes?']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'evaluacion-rapida' },
                        hijos: [
                            {
                                tipo: 'button',
                                atributos: {
                                    class: 'btn-estado btn-jardin',
                                    'data-destino': 'jardin'
                                },
                                eventos: {
                                    click: () => { if (alSeleccionarEstado) alSeleccionarEstado('Saturado Mentalmente', usuario); }
                                },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-brain estado-icono' } },
                                    { tipo: 'span', atributos: { class: 'estado-texto' }, hijos: ['Saturado Mentalmente'] }
                                ]
                            },
                            {
                                tipo: 'button',
                                atributos: {
                                    class: 'btn-estado btn-respiraciones',
                                    'data-destino': 'respiraciones'
                                },
                                eventos: {
                                    click: () => { if (alSeleccionarEstado) alSeleccionarEstado('respiraciones'); }
                                },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-heart-pulse estado-icono' } },
                                    { tipo: 'span', atributos: { class: 'estado-texto' }, hijos: ['Ansioso'] }
                                ]
                            },
                            {
                                tipo: 'button',
                                atributos: {
                                    class: 'btn-estado btn-pizarra',
                                    'data-destino': 'pizarra'
                                },
                                eventos: {
                                    click: () => { if (alSeleccionarEstado) alSeleccionarEstado('pizarra'); }
                                },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-battery-quarter estado-icono' } },
                                    { tipo: 'span', atributos: { class: 'estado-texto' }, hijos: ['Cansado'] }
                                ]
                            },
                            {
                                tipo: 'button',
                                atributos: { class: 'btn-estado' },
                                eventos: {
                                    click: () => { if (alNoEstoySeguro) alNoEstoySeguro(); }
                                },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-circle-question estado-icono' } },
                                    { tipo: 'span', atributos: { class: 'estado-texto' }, hijos: ['No estoy seguro'] }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}
