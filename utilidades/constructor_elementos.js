import { Elemento } from "./modelos/elemento.js";
/**
 * Construye un Elemento desde un objeto de configuración
 * Soporta: objetos anidados, funciones de evento, texto plano
 * 
 * @param {Object} config - {tipo, atributos, hijos, eventos}
 * @returns {Elemento} - Instancia lista para montar
 */
export function construirElemento(config) {
    try {
        if (!config) {
            throw new Error('No se ha recibido ningún objeto de configuración');
        }

        if (typeof config !== 'object') {
            throw new Error(`Se esperaba objeto, se recibió: ${typeof config}`);
        }

        if (!config.tipo || typeof config.tipo !== 'string') {
            throw new Error('El objeto debe tener propiedad "tipo" (string con etiqueta HTML)');
        }

        const atributos = { ...(config.atributos || {}) };

        if (config.eventos && typeof config.eventos === 'object') {
            Object.entries(config.eventos).forEach(([nombreEvento, handler]) => {
                if (typeof handler === 'function') {
                    const key = nombreEvento.startsWith('on')
                        ? nombreEvento
                        : `on${nombreEvento}`;
                    atributos[key] = handler;
                }
            });
        }

        const elemento = new Elemento(config.tipo, atributos, []);

        if (config.hijos && Array.isArray(config.hijos)) {
            config.hijos.forEach((hijo, index) => {
                procesarHijo(hijo, elemento, index);
            });
        }

        return elemento;

    } catch (error) {
        console.error('Error en construirElemento:', error.message);
        console.error('Config recibida:', config);
        return null;
    }
}

/**
 * Procesa un hijo y lo agrega al elemento padre
 * Maneja: strings, numbers, Elementos, objetos de config, HTMLElements, Text nodes
 */
function procesarHijo(hijo, elementoPadre, index) {
    if (hijo === null || hijo === undefined) {
        return;
    }

    if (typeof hijo === 'string' || typeof hijo === 'number') {
        elementoPadre.agregarHijo(String(hijo));
        return;
    }

    if (hijo instanceof Elemento) {
        elementoPadre.agregarHijo(hijo);
        return;
    }

    if (hijo instanceof HTMLElement || hijo instanceof Text) {
        elementoPadre.agregarHijo(hijo);
        return;
    }

    if (typeof hijo === 'object' && hijo.tipo) {
        const hijoConstruido = construirElemento(hijo);
        if (hijoConstruido) {
            elementoPadre.agregarHijo(hijoConstruido);
        }
        return;
    }

    if (Array.isArray(hijo)) {
        hijo.forEach((subHijo, subIndex) => {
            procesarHijo(subHijo, elementoPadre, `${index}.${subIndex}`);
        });
        return;
    }

    console.warn(`Hijo en posición [${index}] no reconocido:`, hijo);
}


export function el(tipo, atributos = {}, ...hijos) {
    return new Elemento(tipo, atributos, hijos);
}

export function texto(contenido) {
    return document.createTextNode(String(contenido));
}