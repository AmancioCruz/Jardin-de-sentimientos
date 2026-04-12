import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function crearMenuOpciones({ config = {} } = {}) {
    const { contenido = [], clases = '', id = '' } = config;

    return construirElemento({
        tipo: 'div',
        atributos: { class: clases, id },
        hijos: Array.isArray(contenido) ? contenido : [contenido]
    });
}

export function crearDiv({ config = {} } = {}) {
    const { contenido = [], clases = '', id = '' } = config;

    return construirElemento({
        tipo: 'div',
        atributos: { class: clases, id },
        hijos: Array.isArray(contenido) ? contenido : [contenido]
    });
}
