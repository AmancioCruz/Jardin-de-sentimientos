import { construirElemento } from "../../utilidades/constructor_elementos.js";

const evaluacion = {
    titulo: "Revisión",
    instruccion: "Del 1 al 5, marca qué tanto se parece cada frase a cómo te sientes ahora.",
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
            texto: "Me siento abrumado por lo que tengo en mente."
        },
        {
            id: "concentracion",
            texto: "Me cuesta concentrarme."
        },
        {
            id: "cansancio",
            texto: "Me siento cansado."
        },
        {
            id: "ansiedad",
            texto: "Me siento inquieto o nervioso."
        }
    ]
};

export function crearEvaluacion(config = {}, alEnviar) {
    const datos = {
        titulo: config.titulo || evaluacion.titulo,
        instruccion: config.instruccion || evaluacion.instruccion,
        escala: config.escala || evaluacion.escala,
        preguntas: config.preguntas || evaluacion.preguntas
    };

    const elementosPreguntas = datos.preguntas.map(pregunta =>
        crearPreguntaLikert(
            pregunta.texto,
            crearOpcionesLikert(pregunta.id, datos.escala.maximo),
            { de: datos.escala.etiquetas.izquierda, a: datos.escala.etiquetas.derecha }
        )
    );

    const formulario = componenteFormularioEvaluacion({
        titulo: datos.titulo,
        instruccion: datos.instruccion,
        preguntas: elementosPreguntas,
        alEnviar
    });

    return contenedorEvaluacion(formulario);
}

const contenedorEvaluacion = (contenido) => construirElemento({
    tipo: 'div',
    atributos: { class: 'contenedor-evaluacion' },
    hijos: Array.isArray(contenido) ? contenido : [contenido]
});

const componenteFormularioEvaluacion = ({ titulo, instruccion, preguntas, alEnviar }) => construirElemento({
    tipo: 'form',
    atributos: { class: 'formulario-app tarjeta-app tarjeta-app--elevada formulario-evaluacion' },
    eventos: {
        submit: (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const respuestas = {};

            for (let [key, value] of formData.entries()) {
                respuestas[key] = Number(value);
            }

            const error = e.target.querySelector('[data-error-evaluacion]');

            if (Object.keys(respuestas).length < preguntas.length) {
                if (error) {
                    error.textContent = 'Responde todas las preguntas para continuar.';
                    error.classList.remove('oculto');
                }
                return;
            }

            error?.classList.add('oculto');

            if (alEnviar && typeof alEnviar === 'function') {
                alEnviar(respuestas);
            }
        }
    },
    hijos: [
        {
            tipo: 'h2',
            atributos: { class: 'titulo-formulario titulo-evaluacion' },
            hijos: [titulo]
        },
        {
            tipo: 'p',
            atributos: { class: 'instruccion-evaluacion' },
            hijos: [instruccion]
        },
        {
            tipo: 'p',
            atributos: {
                class: 'mensaje-error-evaluacion oculto',
                'data-error-evaluacion': '',
                role: 'status',
                'aria-live': 'polite'
            }
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
                        class: 'btn-primario btn-ancho'
                    },
                    hijos: ['Continuar']
                }
            ]
        }
    ]
});

const crearPreguntaLikert = (textoPregunta, opcionesLikert, escala) => construirElemento({
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
                { tipo: 'span', hijos: [escala.de] },
                { tipo: 'span', hijos: [escala.a] }
            ]
        }
    ]
});

const crearOpcionesLikert = (nombre, cantidad = 5) => {
    const opciones = [];

    for (let i = 0; i < cantidad; i++) {
        const valor = i + 1;

        opciones.push(construirElemento({
            tipo: 'label',
            hijos: [
                {
                    tipo: 'input',
                    atributos: {
                        type: 'radio',
                        name: nombre,
                        value: String(valor)
                    },
                    eventos: {
                        change: (evento) => {
                            evento.currentTarget.closest('form')?.querySelector('[data-error-evaluacion]')?.classList.add('oculto');
                        }
                    }
                },
                {
                    tipo: 'span',
                    hijos: [String(valor)]
                }
            ]
        }));
    }

    return opciones;
};
