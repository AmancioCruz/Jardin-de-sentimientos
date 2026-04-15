import { Elemento } from "../utilidades/modelos/elemento.js";
import { contenedores } from "./contenedores_dom.js";
import { actualizarSeccion } from "./sistema_estados.js";

const pantallasRegistradas = new Map();

function _registrarPantalla(clave, config) {
    const { constructor, dependencias = null } = config;
    pantallasRegistradas.set(clave, { constructor, dependencias });
    return pantallasRegistradas.get(clave);
}

export function registrarPantalla(clave, config) {
    if (!config?.constructor || typeof config.constructor !== 'function') {
        console.error(`Error: constructor invalido para "${clave}"`);
        return;
    }

    _registrarPantalla(clave, config);
}

export function mostrarPantalla(clave, usuario = null) {
    const pantalla = pantallasRegistradas.get(clave);

    if (!pantalla) {
        console.error(`No hay pantalla registrada: "${clave}"`);
        return;
    }

    if (usuario) {
        _registrarPantalla(clave, {
            constructor: pantalla.constructor,
            dependencias: { ...pantalla.dependencias, usuario }
        });
    }

    _mostrarPantalla(clave);
}

function _mostrarPantalla(clave) {
    const config = pantallasRegistradas.get(clave);

    if (!config || typeof config.constructor !== 'function') {
        console.error(`Error: "${clave}" no valida`);
        return;
    }

    limpiarCapasGlobales();
    const elemento = config.constructor(config.dependencias);

    if (elemento instanceof Elemento) {
        actualizarSeccion(clave);
        elemento.montar(contenedores.contenido, true);
    } else {
        console.error(`"${clave}" no retorno un Elemento valido`);
    }
}

function limpiarCapasGlobales() {
    document.getElementById('bitacora-detalle')?.remove();
    document.getElementById('evaluacion-cierre-actividad')?.remove();
    document.querySelectorAll('.respiracion-evaluacion-minuto').forEach((capa) => capa.remove());
    document.getElementById('tutorial-actividad')?.remove();
    document.getElementById('panel-texto-nota')?.remove();
    document.querySelectorAll('.fantasma-sticker').forEach((fantasma) => fantasma.remove());
}
