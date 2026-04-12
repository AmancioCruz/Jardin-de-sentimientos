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

export function crearPanelPrioridades({ prioridadesUsadas = [], alIniciarArrastre } = {}) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            class: 'panel-prioridades oculto',
            id: 'panel-prioridades',
            'aria-label': 'Prioridades disponibles'
        },
        hijos: prioridadesDisponibles.map((prioridad) =>
            crearStickerPrioridad({
                prioridad,
                usado: prioridadesUsadas.includes(prioridad.valor),
                alIniciarArrastre
            })
        )
    });
}

export function actualizarPanelPrioridades(panel, prioridadesUsadas = []) {
    if (!panel) return;

    const tableroTieneTodasLasPrioridades = prioridadesUsadas.length >= prioridadesDisponibles.length;
    panel.classList.toggle('panel-prioridades--bloqueado', tableroTieneTodasLasPrioridades);

    panel.querySelectorAll('[data-prioridad]').forEach((boton) => {
        const usado = prioridadesUsadas.includes(boton.dataset.prioridad);
        const bloqueado = tableroTieneTodasLasPrioridades;

        boton.classList.toggle('sticker-prioridad--usado', usado);
        boton.classList.toggle('sticker-prioridad--bloqueado', bloqueado);
        boton.disabled = bloqueado;
        boton.setAttribute('aria-disabled', String(bloqueado));
    });
}

function crearStickerPrioridad({ prioridad, usado, alIniciarArrastre }) {
    return {
        tipo: 'button',
        atributos: {
            type: 'button',
            class: `sticker-prioridad sticker-prioridad--${prioridad.valor}${usado ? ' sticker-prioridad--usado' : ''}`,
            'data-prioridad': prioridad.valor,
            'aria-disabled': String(usado),
            title: `Prioridad ${prioridad.etiqueta}`
        },
        eventos: {
            pointerdown: (evento) => {
                if (evento.currentTarget.disabled) return;

                if (typeof alIniciarArrastre === 'function') {
                    alIniciarArrastre(prioridad.valor, evento);
                }
            }
        },
        hijos: [
            { tipo: 'i', atributos: { class: prioridad.icono } },
            { tipo: 'span', hijos: [prioridad.etiqueta] }
        ]
    };
}
