import { crearConsentimiento } from "./terminos.js";
import { consentimientoData } from "./datos.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";

export function componenteTerminos({ alAceptar = null, alCerrar = null } = {}) {
    quitarTerminos();

    const terminos = crearConsentimiento({
        consentimientoData,
        alAceptar: async () => {
            if (alAceptar && typeof alAceptar === 'function') {
                await alAceptar();
            }
            quitarTerminos();
        },
        alCerrar: () => {
            quitarTerminos();
            if (alCerrar && typeof alCerrar === 'function') {
                alCerrar();
            }
        }
    });

    terminos.montar(contenedores.contenido);
    return terminos;
}

export function quitarTerminos() {
    const elemento = document.querySelector('#contenedor-consentimiento');
    if (elemento) {
        elemento.remove();
    }
}
