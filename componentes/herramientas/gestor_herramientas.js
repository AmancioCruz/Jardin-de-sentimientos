import { crearBoton } from "./botones.js";
import { crearDiv } from "./menu.js";

export function crearMenuHerramientas({ config = {} } = {}) {
    const { contenido = [], clases = '', id = '' } = config;

    return crearDiv({
        config: {
            contenido,
            clases,
            id
        }
    });
}

/* Mantiene compatibilidad con el nombre anterior mientras se actualizan usos viejos. */
export const crearMenuHerraminetas = crearMenuHerramientas;

export function crearMenuDesplegable({
    clases = '',
    id = '',
    configBoton = {
        clases: '',
        contenido: 'botón'
    },
    configOpciones = {
        clases: 'oculto',
        contenido: []
    }
} = {}) {
    let estaDesplegado = false;

    const {
        clases: clasesBoton = '',
        contenido: contenidoBoton = 'botón'
    } = configBoton;

    const {
        clases: clasesOpciones = 'oculto',
        contenido: contenidoOpciones = []
    } = configOpciones;

    function desplegar() {
        if (!contenedorOpciones.nodo) return;
        contenedorOpciones.nodo.classList.remove('oculto');
        estaDesplegado = true;
    }

    function contraer() {
        if (!contenedorOpciones.nodo) return;
        contenedorOpciones.nodo.classList.add('oculto');
        estaDesplegado = false;
    }

    function alternar() {
        if (estaDesplegado) {
            contraer();
            return;
        }

        desplegar();
    }

    const boton = crearBoton({
        config: {
            contenido: contenidoBoton,
            clases: clasesBoton
        },
        eventoClick: alternar
    });

    const contenedorOpciones = crearDiv({
        config: {
            contenido: contenidoOpciones,
            clases: clasesOpciones
        }
    });

    const contenedorMenu = crearDiv({
        config: {
            contenido: [boton, contenedorOpciones],
            clases,
            id
        }
    });

    function agregarBoton(boton) {
        contenedorOpciones.agregarHijo(boton);
        return api;
    }

    function crearBotonOpcion({ contenido, clases = '', eventoClick } = {}) {
        const botonOpcion = crearBoton({
            config: {
                contenido,
                clases
            },
            eventoClick
        });

        agregarBoton(botonOpcion);
        return botonOpcion;
    }

    const api = {
        contenedorMenu,
        contenedorOpciones,
        boton,
        desplegar,
        contraer,
        alternar,
        agregarBoton,
        crearBotonOpcion
    };

    return api;
}
