import { crearInicio } from "./inicio.js";
import { registrarPantalla, mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearEvaluacion } from "../../componentes/evaluacion/evaluacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { crearComponenteCanvas } from "../../componentes/canvas/canvas.js";
import { inicializarTablero } from "../../modulos/actividades/coordinador_actividades.js";
import { obtenerOCrearTableroActivo, obtenerTableroActivo } from "../../modulos/actividades/tablero/estado_tablero.js";

const datosEvaluacion = {
    titulo: "Evaluacion rapida",
    instruccion: "Del 1 al 5, que tanto te identificas con cada afirmacion?",
    escala: {
        minimo: 1,
        maximo: 5,
        etiquetas: {
            izquierda: "Nada",
            derecha: "Mucho"
        }
    },
    preguntas: [
        { id: "estres", texto: "Me siento abrumado por mis actividades" },
        { id: "concentracion", texto: "Me cuesta concentrarme" },
        { id: "cansancio", texto: "Me siento cansado" },
        { id: "ansiedad", texto: "Me siento inquieto o nervioso" }
    ]
};

registrarPantalla(seccionesApp.inicio, {
    constructor: crearInicio,
    dependencias: {
        callbacks: {
            alSeleccionarEstado: (estado, usuario) => manejarEstados(estado, usuario),
            alNoEstoySeguro: manejarNoEstoySeguro
        }
    }
});

function manejarEstados(estado, usuario) {
    if (estado === 'Saturado Mentalmente') {
        obtenerOCrearTableroActivo({ estado });
        abrirTablero(usuario);
    }
}

export function abrirTablero(usuario = null) {
    const lienzo = crearComponenteCanvas(25);

    document.body.classList.add('actividad-activa');
    contenedores.contenido.classList.add('actividad-activa');

    inicializarTablero(lienzo, {
        tablero: obtenerTableroActivo(),
        alGuardar: () => {
            document.body.classList.remove('actividad-activa');
            contenedores.contenido.classList.remove('actividad-activa');
            mostrarPantalla(seccionesApp.inicio, usuario);
        }
    });
}

function manejarNoEstoySeguro() {
    /* Esta seccion funciona como apoyo cuando el usuario no identifica su estado.
       Muestra una evaluacion corta sin salir del espacio principal de la app. */
    const evaluacion = crearEvaluacion(datosEvaluacion, () => {});
    evaluacion.montar(contenedores.contenido, true);
}
