import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function mostrarBitacora(nombreUsuario, alEvaluarRapida, alEvaluarCompleta) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-bitacora',
            class: 'bitacora-contenedor'
        },
        hijos: [
            {
                tipo: 'h1',
                atributos: { class: 'inicio-saludo' },
                hijos: ["Pagina de Bitacora"]
            },
        
        ]
    });
}
