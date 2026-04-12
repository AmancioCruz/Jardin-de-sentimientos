import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function mostrarBitacora() {
    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-bitacora',
            class: 'bitacora-contenedor'
        },
        hijos: [
            {
                tipo: 'h1',
                atributos: { class: 'titulo-pantalla' },
                hijos: ["Página de Bitácora"]
            }
        ]
    });
}
