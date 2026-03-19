import { crearInicio } from "./inicio.js";
import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearEvaluacion } from "../../componentes/evaluacion/evaluacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";

const datosEvaluacion = {
    titulo: "Evaluación rápida",

    instruccion: "Del 1 al 5, ¿qué tanto te identificas con cada afirmación?",

    escala: {
        minimo: 1,
        maximo: 5,
        etiquetas: {
            izquierda: "Nada",
            derecha: "Mucho"
        }
    },

    preguntas: [
        {
            id: "estres",
            texto: "Me siento abrumado por mis actividades"
        },
        {
            id: "concentracion",
            texto: "Me cuesta concentrarme"
        },
        {
            id: "cansancio",
            texto: "Me siento cansado"
        },
        {
            id: "ansiedad",
            texto: "Me siento inquieto o nervioso"
        }
    ]
};

registrarPantalla(seccionesApp.inicio, {
    constructor: crearInicio,
    dependencias: {
        callbacks: {
            alSeleccionarEstado: () => { console.log('opcion') },
            alNoEstoySeguro: manejarNoEstoySeguro
        }
    }
})

function manejarNoEstoySeguro() {
    console.log('no estoy seguro');
    const evaluacion = crearEvaluacion(datosEvaluacion, (datos) => {
        console.log(datos);
    })
    evaluacion.montar(contenedores.contenido, true);

}

