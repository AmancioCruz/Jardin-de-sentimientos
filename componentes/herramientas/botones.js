import { construirElemento } from "../../utilidades/constructor_elementos.js";

/**
 * Crea un boton configurable para los menus de herramientas.
 *
 * Necesita:
 * - contenido: texto, icono o estructura que ira dentro del boton.
 * - clases: clases visuales que ya existen en el sistema de estilos.
 * - eventoClick: accion que se ejecuta cuando el usuario presiona el boton.
 */
export function crearBoton({ config = {}, eventoClick } = {}) {
    const { contenido = 'Botón', clases = '' } = config;

    return construirElemento({
        tipo: 'button',
        atributos: { class: clases },
        hijos: [contenido],
        eventos: {
            click: typeof eventoClick === 'function'
                ? (event) => eventoClick(event)
                : null
        }
    });
}
