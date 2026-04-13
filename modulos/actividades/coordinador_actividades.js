import { contenedores } from "../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../utilidades/constructor_elementos.js";
import {
    alActualizarNotas,
    alSeleccionarNota,
    alSolicitarEdicionNota,
    cambiarPrioridadNotaSeleccionada,
    cambiarTamanoNotaSeleccionada,
    dibujarTablero,
    guardarTextoNotaSeleccionada,
    limpiarTablero,
    obtenerPrioridadNotaSeleccionada,
    obtenerRectNotaSeleccionada,
    obtenerPrioridadesUsadas,
    prepararTablero,
    tableroTieneMaximoNotas
} from "./tablero/tablero_notas.js";
import { finalizarTableroActivo } from "./tablero/estado_tablero.js";
import { crearFormularioTextoNota } from "./tablero/formulario_texto_nota.js";

export function inicializarTablero(lienzo, { tablero = null, alGuardar } = {}) {
    const vistaTablero = crearVistaTablero();
    vistaTablero.montar(contenedores.contenido, true);

    const areaLienzo = vistaTablero.nodo.querySelector('[data-area-lienzo-tablero]');
    lienzo.montar(areaLienzo, true);
    ajustarLienzoTablero(lienzo.nodo, areaLienzo);
    prepararTablero(lienzo, tablero);

    const actualizarControlesNota = () => {
        actualizarPosicionPanelTamano(panelTamano.nodo);
        actualizarPosicionPanelPrioridad(panelPrioridad.nodo);
        actualizarEstadoPanelPrioridad(panelPrioridad.nodo);
    };
    const panelTamano = crearPanelTamanoNota(actualizarControlesNota);
    const panelPrioridad = crearPanelPrioridadNota(actualizarControlesNota);
    const accionesTablero = crearAccionesTablero(lienzo, alGuardar);
    const formularioTexto = crearFormularioTextoNota({
        alGuardar: guardarTextoNotaSeleccionada
    });

    const botonAgregarNota = crearBotonAgregarNota(() => {
        if (tableroTieneMaximoNotas()) return;
        dibujarTablero(lienzo);
    });

    panelTamano.montar(areaLienzo);
    panelPrioridad.montar(areaLienzo);
    document.getElementById('panel-texto-nota')?.remove();
    formularioTexto.elemento.montar(document.body);
    accionesTablero.montar(vistaTablero.nodo);
    botonAgregarNota.montar(areaLienzo);

    alActualizarNotas(({ completo }) => {
        actualizarBotonAgregarNota(botonAgregarNota.nodo, completo);
    });

    alSeleccionarNota((haySeleccion) => {
        panelTamano.nodo?.classList.toggle('oculto', !haySeleccion);
        panelPrioridad.nodo?.classList.toggle('oculto', !haySeleccion);
        if (!haySeleccion) {
            formularioTexto.cerrar();
            return;
        }

        actualizarControlesNota();
    });

    alSolicitarEdicionNota((contenidoNota) => {
        formularioTexto.abrir(contenidoNota);
        actualizarControlesNota();
    });

    actualizarBotonAgregarNota(botonAgregarNota.nodo, tableroTieneMaximoNotas());
}

function crearVistaTablero() {
    return construirElemento({
        tipo: 'section',
        atributos: { class: 'actividad-tablero' },
        hijos: [
            {
                tipo: 'div',
                atributos: {
                    class: 'tablero-lienzo-area',
                    'data-area-lienzo-tablero': ''
                }
            }
        ]
    });
}

function ajustarLienzoTablero(canvas, contenedor) {
    if (!canvas || !contenedor) return;

    canvas.width = Math.max(320, Math.floor(contenedor.clientWidth));
    canvas.height = Math.max(320, Math.floor(contenedor.clientHeight));
}

function actualizarPosicionPanelTamano(panel) {
    const rectNota = obtenerRectNotaSeleccionada();
    const contenedor = panel?.parentElement;

    if (!panel || !rectNota || !contenedor) return;

    const margen = 10;
    const anchoPanel = panel.offsetWidth || 76;
    const altoPanel = panel.offsetHeight || 126;
    const anchoContenedor = contenedor.clientWidth;
    const altoContenedor = contenedor.clientHeight;
    const espacioInterno = 12;
    const left = rectNota.left + espacioInterno;
    const top = rectNota.top + rectNota.height - altoPanel - espacioInterno;

    panel.style.left = `${limitar(left, margen, anchoContenedor - anchoPanel - margen)}px`;
    panel.style.top = `${limitar(top, margen, altoContenedor - altoPanel - margen)}px`;
    panel.style.bottom = 'auto';
}

function crearBotonAgregarNota(alAgregar) {
    return construirElemento({
        tipo: 'button',
        atributos: {
            type: 'button',
            class: 'menu-herramientas btn-tablero-toggle btn-agregar-nota',
            title: 'Agregar nota',
            'aria-label': 'Agregar nota'
        },
        eventos: {
            click: alAgregar
        },
        hijos: [
            { tipo: 'i', atributos: { class: 'fa-solid fa-note-sticky' } },
            { tipo: 'span', hijos: ['Nota'] }
        ]
    });
}

function actualizarPosicionPanelPrioridad(panel) {
    const rectNota = obtenerRectNotaSeleccionada();
    const contenedor = panel?.parentElement;

    if (!panel || !rectNota || !contenedor) return;

    const margen = 10;
    const anchoPanel = panel.offsetWidth || 34;
    const altoPanel = panel.offsetHeight || 104;
    const anchoContenedor = contenedor.clientWidth;
    const altoContenedor = contenedor.clientHeight;
    const separacion = 8;
    let left = rectNota.left + rectNota.width + separacion;
    const top = rectNota.top + (rectNota.height / 2) - (altoPanel / 2);

    if (left + anchoPanel > anchoContenedor - margen) {
        left = rectNota.left - anchoPanel - separacion;
    }

    panel.style.left = `${limitar(left, margen, anchoContenedor - anchoPanel - margen)}px`;
    panel.style.top = `${limitar(top, margen, altoContenedor - altoPanel - margen)}px`;
    panel.style.bottom = 'auto';
}

function actualizarEstadoPanelPrioridad(panel) {
    if (!panel) return;

    const prioridadActual = obtenerPrioridadNotaSeleccionada();
    const prioridadesUsadas = obtenerPrioridadesUsadas();

    panel.querySelectorAll('[data-prioridad-nota]').forEach((boton) => {
        const activo = boton.dataset.prioridadNota === prioridadActual;
        const usadoEnOtraNota = prioridadesUsadas.includes(boton.dataset.prioridadNota) && !activo;

        boton.classList.toggle('btn-prioridad-nota--activa', activo);
        boton.classList.toggle('btn-prioridad-nota--usada', usadoEnOtraNota);
        boton.setAttribute('aria-pressed', String(activo));
    });
}

function limitar(valor, minimo, maximo) {
    if (maximo < minimo) return minimo;
    return Math.min(Math.max(valor, minimo), maximo);
}

function crearAccionesTablero(lienzo, alGuardar) {
    return construirElemento({
        tipo: 'div',
        atributos: { class: 'tablero-acciones' },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'tablero-acciones__botones' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'button',
                            class: 'btn-tablero-mini',
                            title: 'Limpiar tablero'
                        },
                        eventos: {
                            click: () => limpiarTablero(lienzo)
                        },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-trash' } },
                            'Limpiar'
                        ]
                    },
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'button',
                            class: 'btn-actividad-salir',
                            title: 'Guardar tablero'
                        },
                        eventos: {
                            click: () => {
                                finalizarTableroActivo();
                                if (typeof alGuardar === 'function') {
                                    alGuardar(lienzo.nodo);
                                }
                            }
                        },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-check' } },
                            'Guardar'
                        ]
                    }
                ]
            }
        ]
    });
}

function crearPanelPrioridadNota(alCambiarPrioridad) {
    const prioridades = [
        { valor: 'alta', icono: 'fa-solid fa-fire', titulo: 'Prioridad alta' },
        { valor: 'media', icono: 'fa-solid fa-star-half-stroke', titulo: 'Prioridad media' },
        { valor: 'baja', icono: 'fa-solid fa-leaf', titulo: 'Prioridad baja' }
    ];

    return construirElemento({
        tipo: 'div',
        atributos: {
            class: 'panel-prioridad-nota oculto',
            id: 'panel-prioridad-nota',
            'aria-label': 'Cambiar prioridad de nota'
        },
        hijos: prioridades.map((prioridad) => ({
            tipo: 'button',
            atributos: {
                type: 'button',
                class: `btn-prioridad-nota btn-prioridad-nota--${prioridad.valor}`,
                title: prioridad.titulo,
                'aria-pressed': 'false',
                'data-prioridad-nota': prioridad.valor
            },
            eventos: {
                click: () => {
                    cambiarPrioridadNotaSeleccionada(prioridad.valor);
                    if (typeof alCambiarPrioridad === 'function') alCambiarPrioridad();
                }
            },
            hijos: [
                { tipo: 'i', atributos: { class: prioridad.icono } }
            ]
        }))
    });
}

function crearPanelTamanoNota(alCambiarTamano) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            class: 'panel-tamano-nota oculto',
            id: 'panel-tamano-nota',
            'aria-label': 'Cambiar tamaño de nota'
        },
        hijos: [
            {
                tipo: 'button',
                atributos: {
                    type: 'button',
                    class: 'btn-tamano-nota',
                    title: 'Hacer nota más pequeña'
                },
                eventos: {
                    click: () => {
                        cambiarTamanoNotaSeleccionada(-24);
                        if (typeof alCambiarTamano === 'function') alCambiarTamano();
                    }
                },
                hijos: [
                    { tipo: 'i', atributos: { class: 'fa-solid fa-minus' } }
                ]
            },
            {
                tipo: 'span',
                atributos: { class: 'panel-tamano-nota__texto' },
                hijos: ['Tamaño']
            },
            {
                tipo: 'button',
                atributos: {
                    type: 'button',
                    class: 'btn-tamano-nota',
                    title: 'Hacer nota más grande'
                },
                eventos: {
                    click: () => {
                        cambiarTamanoNotaSeleccionada(24);
                        if (typeof alCambiarTamano === 'function') alCambiarTamano();
                    }
                },
                hijos: [
                    { tipo: 'i', atributos: { class: 'fa-solid fa-plus' } }
                ]
            }
        ]
    });
}

function actualizarBotonAgregarNota(boton, completo) {
    if (!boton) return;

    boton.disabled = completo;
    boton.classList.toggle('btn-opcion--deshabilitado', completo);
    boton.setAttribute('aria-label', completo
        ? 'Límite de notas alcanzado'
        : 'Agregar nota');
}
