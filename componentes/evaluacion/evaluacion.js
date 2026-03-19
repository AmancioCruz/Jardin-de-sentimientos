import { construirElemento } from "../../utilidades/constructor_elementos.js"

const evaluacion = {
    titulo: "Evaluación ",

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

export function crearEvaluacion(config = {}, alEnviar) {
    // Merge de configuración con defaults
    const datos = {
        titulo: config.titulo || evaluacion.titulo,
        instruccion: config.instruccion || evaluacion.instruccion,
        escala: config.escala || evaluacion.escala,
        preguntas: config.preguntas || evaluacion.preguntas
    };

    // Crear preguntas Likert
    const elementosPreguntas = datos.preguntas.map(pregunta =>
        crearPreguntaLikert(
            pregunta.texto,
            crearOpcionesLikert(pregunta.id, datos.escala.maximo),
            { de: datos.escala.etiquetas.izquierda, a: datos.escala.etiquetas.derecha }
        )
    );

    // Crear formulario completo
    const formulario = componenteFormularioEvaluacion({
        titulo: datos.titulo,
        instruccion: datos.instruccion,
        preguntas: elementosPreguntas,
        alEnviar: alEnviar
    });

    // Envolver en contenedor
    return contenedorEvaluacion(formulario);
}



const contenedorEvaluacion = (contenido) => {
    return construirElemento(
        {
            tipo: 'div',
            atributos: { class: 'contenedor-evaluacion' },
            hijos: Array.isArray(contenido) ? contenido : [contenido]
        }
    )
}

const datosformulario = {
    titulo: 'Evaluación rápida',
    instruccion: ' Del 1 al 5, ¿qué tanto te identificas con cada afirmación?'
}

const componenteFormularioEvaluacion = ({ titulo, instruccion, preguntas, alEnviar }) => {
    return construirElemento({
        tipo: 'form',
        atributos: { class: 'formulario-evaluacion' },
        eventos: {
            submit: (e) => {
                e.preventDefault();

                const formData = new FormData(e.target);
                const respuestas = {};

                for (let [key, value] of formData.entries()) {
                    respuestas[key] = Number(value);
                }

                const totalPreguntas = preguntas.length;
                const totalRespuestas = Object.keys(respuestas).length;

                if (totalRespuestas < totalPreguntas) {
                    alert('Por favor responde todas las preguntas');
                    return;
                }

                if (alEnviar && typeof alEnviar === 'function') {
                    alEnviar(respuestas);
                }
            }
        },
        hijos: [
            {
                tipo: 'h2',
                atributos: { class: 'titulo-evaluacion' },
                hijos: [titulo]
            },
            {
                tipo: 'p',
                atributos: { class: 'instruccion-evaluacion' },
                hijos: [instruccion]
            },
            ...preguntas,
            {
                tipo: 'div',
                atributos: { class: 'acciones-evaluacion' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'submit',
                            class: 'btn-enviar'
                        },
                        hijos: ['Continuar']
                    }
                ]
            }
        ]
    });
};

const crearPreguntaLikert = (textoPregunta, opcionesLikert, escala) => {
    return construirElemento(
        {
            tipo: 'div',
            atributos: { class: 'pregunta-evaluacion' },
            hijos: [
                {
                    tipo: 'p',
                    atributos: { class: 'texto-pregunta' },
                    hijos: [textoPregunta]
                },
                {
                    tipo: 'div',
                    atributos: { class: 'likert-numerico' },
                    hijos: opcionesLikert
                },
                {
                    tipo: 'div',
                    atributos: { class: 'likert-extremos' },
                    hijos: [
                        {
                            tipo: 'span',
                            hijos: [escala.de]
                        },
                        {
                            tipo: 'span',
                            hijos: [escala.a]
                        }
                    ]
                }
            ]
        }
    )
}

const crearOpcionesLikert = (nombre, cantidad = 5) => {
    const opciones = [];

    for (let i = 0; i < cantidad; i++) {
        const valor = i + 1;

        opciones.push(
            construirElemento({
                tipo: 'label',
                hijos: [
                    {
                        tipo: 'input',
                        atributos: {
                            type: 'radio',
                            name: nombre,
                            value: String(valor)
                        }
                    },
                    {
                        tipo: 'span',
                        hijos: [String(valor)]
                    }
                ]
            })
        );
    }

    return opciones;
};