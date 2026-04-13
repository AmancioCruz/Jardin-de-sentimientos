import { construirElemento } from "../../../utilidades/constructor_elementos.js";

const limitePreocupacion = 8;
const limiteAccion = 10;
const limiteSentimiento = 8;

export function crearFormularioTextoNota({ alGuardar } = {}) {
    const formulario = construirElemento({
        tipo: 'form',
        atributos: {
            class: 'panel-texto-nota oculto',
            id: 'panel-texto-nota'
        },
        eventos: {
            submit: (evento) => {
                evento.preventDefault();
                manejarEnvio(evento.currentTarget, alGuardar);
            }
        },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'panel-texto-nota__cabecera' },
                hijos: [
                    {
                        tipo: 'strong',
                        hijos: ['Editar nota']
                    },
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'button',
                            class: 'panel-texto-nota__cerrar',
                            'aria-label': 'Cerrar editor'
                        },
                        eventos: {
                            click: () => cerrar(formulario.nodo)
                        },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-xmark' } }
                        ]
                    }
                ]
            },
            {
                tipo: 'label',
                atributos: { class: 'campo-nota' },
                hijos: [
                    {
                        tipo: 'span',
                        hijos: [`¿Qué tienes en mente? Max. ${limitePreocupacion} palabras`]
                    },
                    {
                        tipo: 'input',
                        atributos: {
                            type: 'text',
                            name: 'preocupacion',
                            required: true,
                            placeholder: 'Ej. No terminar capítulo de tesis',
                            autocomplete: 'off'
                        }
                    }
                ]
            },
            {
                tipo: 'fieldset',
                atributos: { class: 'campo-nota campo-nota--opciones' },
                eventos: {
                    change: (evento) => actualizarRutaFormulario(evento.currentTarget.closest('form'))
                },
                hijos: [
                    {
                        tipo: 'legend',
                        hijos: ['¿Está en tus manos hacer algo ahora?']
                    },
                    {
                        tipo: 'label',
                        hijos: [
                            {
                                tipo: 'input',
                                atributos: {
                                    type: 'radio',
                                    name: 'estaEnMisManos',
                                    value: 'si',
                                    checked: true
                                }
                            },
                            ' Si'
                        ]
                    },
                    {
                        tipo: 'label',
                        hijos: [
                            {
                                tipo: 'input',
                                atributos: {
                                    type: 'radio',
                                    name: 'estaEnMisManos',
                                    value: 'no'
                                }
                            },
                            ' No'
                        ]
                    }
                ]
            },
            {
                tipo: 'label',
                atributos: { class: 'campo-nota campo-nota--accion' },
                hijos: [
                    {
                        tipo: 'span',
                        hijos: [`¿Qué puedes hacer ya? Max. ${limiteAccion} palabras`]
                    },
                    {
                        tipo: 'input',
                        atributos: {
                            type: 'text',
                            name: 'accion',
                            placeholder: 'Ej. Escribir introducción con música',
                            autocomplete: 'off'
                        }
                    }
                ]
            },
            {
                tipo: 'div',
                atributos: { class: 'campo-nota campo-nota--apoyo oculto' },
                hijos: [
                    {
                        tipo: 'p',
                        hijos: ['No tienes que resolverlo solo. Puedes pedir apoyo y usar esta nota para expresar lo que sientes.']
                    },
                    {
                        tipo: 'label',
                        hijos: [
                            {
                                tipo: 'span',
                                hijos: [`¿Cómo te hace sentir? Max. ${limiteSentimiento} palabras`]
                            },
                            {
                                tipo: 'input',
                                atributos: {
                                    type: 'text',
                                    name: 'sentimiento',
                                    placeholder: 'Ej. Ansioso pero con esperanza',
                                    autocomplete: 'off'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tipo: 'div',
                atributos: { class: 'panel-texto-nota__acciones' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'button',
                            class: 'btn-texto-nota btn-texto-nota--secundario'
                        },
                        eventos: {
                            click: () => cerrar(formulario.nodo)
                        },
                        hijos: ['Cancelar']
                    },
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'submit',
                            class: 'btn-texto-nota btn-texto-nota--principal'
                        },
                        hijos: ['Guardar']
                    }
                ]
            }
        ]
    });

    return {
        elemento: formulario,
        abrir: (contenido = {}) => abrir(formulario.nodo, contenido),
        cerrar: () => cerrar(formulario.nodo)
    };
}

function abrir(nodo, contenido = {}) {
    if (!nodo) return;

    nodo.classList.remove('oculto');
    llenarFormulario(nodo, contenido);
    actualizarRutaFormulario(nodo);
    nodo.querySelector('[name="preocupacion"]')?.focus();
}

function cerrar(nodo) {
    nodo?.classList.add('oculto');
}

function manejarEnvio(formulario, alGuardar) {
    const datos = leerFormulario(formulario);
    const error = validarDatos(datos);

    if (error) {
        alert(error);
        return;
    }

    if (typeof alGuardar === 'function') {
        alGuardar(datos);
    }

    cerrar(formulario);
}

function llenarFormulario(formulario, contenido = {}) {
    formulario.elements.preocupacion.value = contenido.preocupacion || '';
    formulario.elements.accion.value = contenido.accion || '';
    formulario.elements.sentimiento.value = contenido.sentimiento || '';

    const valorManos = contenido.estaEnMisManos === false ? 'no' : 'si';
    formulario.querySelector(`[name="estaEnMisManos"][value="${valorManos}"]`).checked = true;
}

function leerFormulario(formulario) {
    const estaEnMisManos = formulario.elements.estaEnMisManos.value === 'si';

    return {
        preocupacion: limpiarTexto(formulario.elements.preocupacion.value),
        estaEnMisManos,
        accion: estaEnMisManos ? limpiarTexto(formulario.elements.accion.value) : '',
        sentimiento: estaEnMisManos ? '' : limpiarTexto(formulario.elements.sentimiento.value)
    };
}

function validarDatos(datos) {
    if (!datos.preocupacion) {
        return 'Escribe en pocas palabras que tienes en mente.';
    }

    if (contarPalabras(datos.preocupacion) > limitePreocupacion) {
        return `La primera respuesta debe tener máximo ${limitePreocupacion} palabras.`;
    }

    if (datos.estaEnMisManos && !datos.accion) {
        return 'Escribe una acción pequeña que sí puedas hacer.';
    }

    if (datos.estaEnMisManos && contarPalabras(datos.accion) > limiteAccion) {
        return `La acción debe tener máximo ${limiteAccion} palabras.`;
    }

    if (!datos.estaEnMisManos && !datos.sentimiento) {
        return 'Escribe como te hace sentir para poder soltarlo en la nota.';
    }

    if (!datos.estaEnMisManos && contarPalabras(datos.sentimiento) > limiteSentimiento) {
        return `El sentimiento debe tener máximo ${limiteSentimiento} palabras.`;
    }

    return '';
}

function actualizarRutaFormulario(formulario) {
    if (!formulario) return;

    const estaEnMisManos = formulario.elements.estaEnMisManos.value === 'si';

    formulario.querySelector('.campo-nota--accion')?.classList.toggle('oculto', !estaEnMisManos);
    formulario.querySelector('.campo-nota--apoyo')?.classList.toggle('oculto', estaEnMisManos);
}

function limpiarTexto(texto) {
    return texto.trim().replace(/\s+/g, ' ');
}

function contarPalabras(texto) {
    return limpiarTexto(texto).split(' ').filter(Boolean).length;
}
