import { crearMenuDesplegable } from "../../componentes/herramientas/gestor_herramientas.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../utilidades/constructor_elementos.js";
import {
    alActualizarNotas,
    alActualizarPrioridades,
    alSeleccionarNota,
    cambiarTamanoNotaSeleccionada,
    dibujarTablero,
    guardarTextoNotaSeleccionada,
    iniciarArrastrePrioridad,
    obtenerTextoNotaSeleccionada,
    obtenerPrioridadesUsadas,
    prepararTablero,
    tableroTieneMaximoNotas
} from "./tablero/tablero_notas.js";
import { finalizarTableroActivo } from "./tablero/estado_tablero.js";
import { crearFormularioTextoNota } from "./tablero/formulario_texto_nota.js";
import { actualizarPanelPrioridades, crearPanelPrioridades } from "./tablero/stickers_prioridad.js";

export function inicializarTablero(lienzo, { tablero = null, alGuardar } = {}) {
    lienzo.montar(contenedores.contenido, true);
    prepararTablero(lienzo, tablero);
    const panelPrioridades = crearPanelPrioridades({
        prioridadesUsadas: obtenerPrioridadesUsadas(),
        alIniciarArrastre: iniciarArrastrePrioridad
    });
    const panelTamano = crearPanelTamanoNota();
    const botonGuardar = crearBotonGuardarTablero(alGuardar);
    const formularioTexto = crearFormularioTextoNota({
        alGuardar: guardarTextoNotaSeleccionada
    });

    /* Este menu flotante agrupa las acciones del tablero.
       Las opciones pueden crecer despues sin cambiar la forma base del componente. */
    const menuTablero = crearMenuDesplegable({
        clases: 'menu-herramientas',
        id: 'menu-desplegable',
        configBoton: {
            clases: 'btn-flotante btn-primario btn-cadrado-m animado',
            contenido: {
                tipo: 'i',
                atributos: { class: 'fa-solid fa-plus' }
            }
        },
        configOpciones: {
            clases: 'contenedor-opciones-menu-herramientas oculto animado',
            contenido: []
        }
    });

    const botonAgregarNota = menuTablero.crearBotonOpcion({
        contenido: {
            tipo: 'i',
            atributos: { class: 'fa-solid fa-note-sticky' }
        },
        clases: 'btn-circulo-m btn-opcion',
        eventoClick: () => {
            if (tableroTieneMaximoNotas()) return;
            dibujarTablero(lienzo);
        }
    });

    menuTablero.crearBotonOpcion({
        contenido: {
            tipo: 'i',
            atributos: { class: 'fa-solid fa-font' }
        },
        clases: 'btn-circulo-m btn-opcion',
        eventoClick: () => {
            const contenidoNota = obtenerTextoNotaSeleccionada();

            if (!contenidoNota) {
                alert('Selecciona una nota para editar su texto.');
                return;
            }

            formularioTexto.abrir(contenidoNota);
        }
    });

    menuTablero.contenedorMenu.montar(contenedores.contenido);
    panelPrioridades.montar(contenedores.contenido);
    panelPrioridades.nodo?.classList.remove('oculto');
    panelTamano.montar(contenedores.contenido);
    document.getElementById('panel-texto-nota')?.remove();
    formularioTexto.elemento.montar(document.body);
    botonGuardar.montar(contenedores.contenido);

    alActualizarPrioridades((prioridadesUsadas) => {
        actualizarPanelPrioridades(panelPrioridades.nodo, prioridadesUsadas);
    });

    alActualizarNotas(({ completo }) => {
        actualizarBotonAgregarNota(botonAgregarNota.nodo, completo);
    });

    alSeleccionarNota((haySeleccion) => {
        panelTamano.nodo?.classList.toggle('oculto', !haySeleccion);
        if (!haySeleccion) {
            formularioTexto.cerrar();
        }
    });

    actualizarBotonAgregarNota(botonAgregarNota.nodo, tableroTieneMaximoNotas());
}

function crearBotonGuardarTablero(alGuardar) {
    return construirElemento({
        tipo: 'button',
        atributos: {
            type: 'button',
            class: 'btn-tablero btn-tablero-guardar',
            title: 'Guardar tablero',
            'aria-label': 'Guardar tablero'
        },
        eventos: {
            click: () => {
                finalizarTableroActivo();
                if (typeof alGuardar === 'function') {
                    alGuardar();
                }
            }
        },
        hijos: [
            { tipo: 'i', atributos: { class: 'fa-solid fa-check' } }
        ]
    });
}

function crearPanelTamanoNota() {
    return construirElemento({
        tipo: 'div',
        atributos: {
            class: 'panel-tamano-nota oculto',
            id: 'panel-tamano-nota',
            'aria-label': 'Cambiar tamano de nota'
        },
        hijos: [
            {
                tipo: 'button',
                atributos: {
                    type: 'button',
                    class: 'btn-tamano-nota',
                    title: 'Hacer nota mas pequena'
                },
                eventos: {
                    click: () => cambiarTamanoNotaSeleccionada(-24)
                },
                hijos: [
                    { tipo: 'i', atributos: { class: 'fa-solid fa-minus' } }
                ]
            },
            {
                tipo: 'span',
                atributos: { class: 'panel-tamano-nota__texto' },
                hijos: ['Tamano']
            },
            {
                tipo: 'button',
                atributos: {
                    type: 'button',
                    class: 'btn-tamano-nota',
                    title: 'Hacer nota mas grande'
                },
                eventos: {
                    click: () => cambiarTamanoNotaSeleccionada(24)
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
        ? 'Limite de notas alcanzado'
        : 'Agregar nota');
}
