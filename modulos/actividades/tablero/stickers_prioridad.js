import { construirElemento } from "../../../utilidades/constructor_elementos.js";

export const prioridadesDisponibles = [
    {
        valor: 'alta',
        etiqueta: 'Alta',
        icono: 'fa-solid fa-fire'
    },
    {
        valor: 'media',
        etiqueta: 'Media',
        icono: 'fa-solid fa-star-half-stroke'
    },
    {
        valor: 'baja',
        etiqueta: 'Baja',
        icono: 'fa-solid fa-leaf'
    }
];

export function crearPanelPrioridades({
    prioridadesUsadas = [],
    prioridadSeleccionada = '',
    alIniciarArrastre,
    alSeleccionarPrioridad
} = {}) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            class: 'panel-prioridades oculto',
            id: 'panel-prioridades',
            'aria-label': 'Prioridades disponibles'
        },
        hijos: [
            {
                tipo: 'p',
                atributos: { class: 'panel-prioridades__ayuda' },
                hijos: ['Toca una prioridad y luego una nota, o arrastrala']
            },
            ...prioridadesDisponibles.map((prioridad) =>
                crearStickerPrioridad({
                    prioridad,
                    usado: prioridadesUsadas.includes(prioridad.valor),
                    seleccionada: prioridadSeleccionada === prioridad.valor,
                    alSeleccionarPrioridad,
                    alIniciarArrastre
                })
            )
        ]
    });
}

export function actualizarPanelPrioridades(panel, prioridadesUsadas = [], prioridadSeleccionada = '') {
    if (!panel) return;

    panel.querySelectorAll('[data-prioridad]').forEach((boton) => {
        const usado = prioridadesUsadas.includes(boton.dataset.prioridad);
        const seleccionada = prioridadSeleccionada === boton.dataset.prioridad;

        boton.classList.toggle('sticker-prioridad--usado', usado);
        boton.classList.toggle('sticker-prioridad--seleccionada', seleccionada);
        boton.disabled = false;
        boton.setAttribute('aria-pressed', String(seleccionada));
    });
}

function crearStickerPrioridad({
    prioridad,
    usado,
    seleccionada,
    alSeleccionarPrioridad,
    alIniciarArrastre
}) {
    return {
        tipo: 'button',
        atributos: {
            type: 'button',
            class: `sticker-prioridad sticker-prioridad--${prioridad.valor}${usado ? ' sticker-prioridad--usado' : ''}${seleccionada ? ' sticker-prioridad--seleccionada' : ''}`,
            'data-prioridad': prioridad.valor,
            'aria-pressed': String(seleccionada),
            title: `Prioridad ${prioridad.etiqueta}`
        },
        eventos: {
            pointerdown: (evento) => {
                if (typeof alSeleccionarPrioridad === 'function') {
                    alSeleccionarPrioridad(prioridad.valor);
                }

                if (typeof alIniciarArrastre === 'function') {
                    alIniciarArrastre(prioridad.valor, evento);
                }
            }
        },
        hijos: [
            { tipo: 'i', atributos: { class: prioridad.icono } }
        ]
    };
}
