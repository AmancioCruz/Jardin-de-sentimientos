import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function crearComponenteCanvas() {
    return construirElemento({
        tipo: 'canvas',
        atributos: {
            class: 'lienzo-base',
            id: 'lienzo',
            width: 320,
            height: 320
        }
    })
}
