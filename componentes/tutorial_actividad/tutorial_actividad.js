import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function mostrarTutorialActividad({ id, titulo, descripcion, pasos = [], textoBoton = 'Entendido', alCerrar = null } = {}) {
    if (!id) return null;

    const tutorialAnterior = document.getElementById('tutorial-actividad');
    tutorialAnterior?.remove();

    const tutorial = construirElemento({
        tipo: 'div',
        atributos: {
            id: 'tutorial-actividad',
            class: 'tutorial-actividad',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'tutorial-actividad-titulo'
        },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'tutorial-actividad__tarjeta' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'button',
                            class: 'tutorial-actividad__cerrar',
                            'aria-label': 'Cerrar guía'
                        },
                        hijos: [{ tipo: 'i', atributos: { class: 'fa-solid fa-xmark' } }]
                    },
                    { tipo: 'h2', atributos: { id: 'tutorial-actividad-titulo' }, hijos: [titulo || 'Guía rápida'] },
                    descripcion ? { tipo: 'p', hijos: [descripcion] } : null,
                    {
                        tipo: 'ul',
                        atributos: { class: 'tutorial-actividad__lista' },
                        hijos: pasos.map((paso) => ({
                            tipo: 'li',
                            hijos: [
                                { tipo: 'i', atributos: { class: paso.icono || 'fa-solid fa-circle-info' } },
                                { tipo: 'span', hijos: [paso.texto] }
                            ]
                        }))
                    },
                    {
                        tipo: 'button',
                        atributos: { type: 'button', class: 'btn-actividad-salir tutorial-actividad__accion' },
                        hijos: [textoBoton]
                    }
                ]
            }
        ]
    });

    tutorial.montar(document.body);

    let cerrado = false;
    const cerrar = () => {
        if (cerrado) return;
        cerrado = true;
        tutorial.nodo?.remove();
        if (typeof alCerrar === 'function') alCerrar();
    };

    tutorial.nodo.querySelector('.tutorial-actividad__cerrar')?.addEventListener('click', cerrar);
    tutorial.nodo.querySelector('.tutorial-actividad__accion')?.addEventListener('click', cerrar);
    tutorial.nodo.addEventListener('click', (evento) => {
        if (evento.target === tutorial.nodo) cerrar();
    });

    return tutorial.nodo;
}
