import { construirElemento } from "../../../utilidades/constructor_elementos.js";
import { activarOverlay, desactivarOverlay } from "../../../servicios/overlay.js";

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
            },
            input: (evento) => {
                ocultarErrorNota(evento.currentTarget);
            },
            change: (evento) => {
                ocultarErrorNota(evento.currentTarget);
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
                        hijos: [`¿Qué piensas o sientes ahora? Max. ${limitePreocupacion} palabras`]
                    },
                    {
                        tipo: 'input',
                        atributos: {
                            type: 'text',
                            name: 'preocupacion',
                            required: true,
                            placeholder: 'Ej. Me siento bloqueado',
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
                        hijos: ['¿Puedes hacer algo con esto en este momento?']
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
                            ' Sí'
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
                        hijos: [`¿Qué podrías hacer ahora? Max. ${limiteAccion} palabras`]
                    },
                    {
                        tipo: 'input',
                        atributos: {
                            type: 'text',
                            name: 'accion',
                            placeholder: 'Ej. Respirar y pedir apoyo',
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
                        hijos: ['Si ahora no puedes hacer nada, nombrarlo también puede ayudarte a entenderlo.']
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
                                    placeholder: 'Ej. Confundido pero acompañado',
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
            },
            {
                tipo: 'p',
                atributos: {
                    class: 'mensaje-error-nota oculto',
                    'data-error-nota': '',
                    role: 'alert'
                },
                hijos: ['']
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

    activarOverlay('panel-texto-nota', {
        usarBackdrop: true,
        zIndex: 1000,
        alClickBackdrop: () => cerrar(nodo)
    });
    nodo.classList.remove('oculto');
    ocultarErrorNota(nodo);
    llenarFormulario(nodo, contenido);
    actualizarRutaFormulario(nodo);
    nodo.querySelector('[name="preocupacion"]')?.focus();
}

function cerrar(nodo) {
    nodo?.classList.add('oculto');
    desactivarOverlay('panel-texto-nota');
}

function manejarEnvio(formulario, alGuardar) {
    const datos = leerFormulario(formulario);
    const error = validarDatos(datos);

    if (error) {
        mostrarErrorNota(formulario, error);
        return;
    }

    if (typeof alGuardar === 'function') {
        alGuardar(datos);
    }

    cerrar(formulario);
}

function mostrarErrorNota(formulario, mensaje) {
    const error = formulario.querySelector('[data-error-nota]');
    if (!error) return;

    error.textContent = mensaje;
    error.classList.remove('oculto');
}

function ocultarErrorNota(formulario) {
    const error = formulario.querySelector('[data-error-nota]');
    if (!error) return;

    error.textContent = '';
    error.classList.add('oculto');
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
        return 'Escribe en pocas palabras qué tienes en mente.';
    }

    if (contarPalabras(datos.preocupacion) > limitePreocupacion) {
        return `La primera respuesta debe tener máximo ${limitePreocupacion} palabras.`;
    }

    if (datos.estaEnMisManos && !datos.accion) {
        return 'Escribe algo pequeño que podrías hacer ahora.';
    }

    if (datos.estaEnMisManos && contarPalabras(datos.accion) > limiteAccion) {
        return `La acción debe tener máximo ${limiteAccion} palabras.`;
    }

    if (!datos.estaEnMisManos && !datos.sentimiento) {
        return 'Escribe cómo te hace sentir para poder dejarlo en la nota.';
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
