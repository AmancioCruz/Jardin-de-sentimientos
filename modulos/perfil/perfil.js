import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { guardarPreferenciaLocal, obtenerPreferenciasLocales } from "../../servicios/preferencias_locales.js";

export function crearPerfil({ usuario }) {
    const preferencias = obtenerPreferenciasLocales();

    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-perfil',
            class: 'perfil-contenedor'
        },
        hijos: [
            {
                tipo: 'h1',
                atributos: { class: 'titulo-seccion-app perfil-titulo' },
                hijos: ['Perfil']
            },
            {
                tipo: 'section',
                atributos: {
                    class: 'tarjeta-app seccion-informacion',
                    'aria-label': 'Información personal'
                },
                hijos: [
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Información personal']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'dato-perfil-imagen' },
                        hijos: [
                            {
                                tipo: 'img',
                                atributos: {
                                    class: 'imagen-perfil',
                                    src: usuario.urlImagen,
                                    alt: 'Foto de perfil'
                                }
                            }
                        ]
                    },

                    crearDato('Nombre', usuario.nombre),
                    crearDato('Correo', usuario.correo),
                    crearDato('Programa', usuario.programa),
                    crearDato('Semestre', usuario.semestre)
                ]
            },
            {
                tipo: 'section',
                atributos: {
                    class: 'tarjeta-app seccion-configuracion',
                    'aria-label': 'Configuraciones'
                },
                hijos: [
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Preferencias']
                    },

                    crearSelectorPreferencia({
                        etiqueta: 'Sonido durante actividades',
                        id: 'preferencia-sonido',
                        valor: preferencias.sonido,
                        opciones: [
                            { valor: 'silencio', texto: 'Silencio' },
                            { valor: 'lluvia', texto: 'Lluvia' },
                            { valor: 'bosque', texto: 'Bosque' },
                            { valor: 'olas', texto: 'Olas' }
                        ],
                        alCambiar: (valor) => guardarPreferenciaLocal('sonido', valor)
                    }),
                    crearSelectorPreferencia({
                        etiqueta: 'Tema visual',
                        id: 'preferencia-tema',
                        valor: preferencias.tema,
                        opciones: [
                            { valor: 'claro', texto: 'Claro' },
                            { valor: 'oscuro', texto: 'Oscuro' }
                        ],
                        alCambiar: (valor) => guardarPreferenciaLocal('tema', valor)
                    })
                ]
            }
        ]
    });
}

function crearSelectorPreferencia({ etiqueta, id, valor, opciones, alCambiar }) {
    return {
        tipo: 'div',
        atributos: { class: 'dato-perfil dato-perfil--selector' },
        hijos: [
            {
                tipo: 'label',
                atributos: { class: 'etiqueta-dato', for: id },
                hijos: [etiqueta]
            },
            {
                tipo: 'select',
                atributos: {
                    class: 'select-preferencia selector-perfil',
                    id
                },
                eventos: {
                    change: (evento) => {
                        if (typeof alCambiar === 'function') {
                            alCambiar(evento.target.value);
                        }
                    }
                },
                hijos: opciones.map((opcion) => ({
                    tipo: 'option',
                    atributos: {
                        value: opcion.valor,
                        selected: opcion.valor === valor
                    },
                    hijos: [opcion.texto]
                }))
            }
        ]
    };
}

function crearDato(etiqueta, valor) {
    return {
        tipo: 'div',
        atributos: { class: 'dato-perfil' },
        hijos: [
            {
                tipo: 'label',
                atributos: { class: 'etiqueta-dato' },
                hijos: [etiqueta]
            },
            {
                tipo: 'span',
                atributos: { class: 'valor-dato' },
                hijos: [valor || 'No especificado']
            }
        ]
    };
}
