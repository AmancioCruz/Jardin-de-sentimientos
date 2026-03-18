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
        console.error(`Error: constructor inválido para "${clave}"`);
        return;
    }

    _registrarPantalla(clave, config);
    console.log(`✓ Pantalla registrada: ${clave}`);
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
    console.log(pantallasRegistradas)
}

function _mostrarPantalla(clave) {
    const config = pantallasRegistradas.get(clave);

    if (!config || typeof config.constructor !== 'function') {
        console.error(`Error: "${clave}" no válida`);
        return;
    }

    const elemento = config.constructor(config.dependencias);

    if (elemento instanceof Elemento) {
        actualizarSeccion(clave);
        elemento.montar(contenedores.contenido, true);
    } else {
        console.error(`"${clave}" no retornó un Elemento válido`);
    }
}

/*
export function actualizarPantalla(clave, nuevasDependencias) {
    const config = pantallasRegistradas.get(clave);

    if (!config) {
        console.error(`No existe pantalla "${clave}"`);
        return;
    }

    _registrarPantalla(clave, {
        constructor: config.constructor,
        dependencias: nuevasDependencias
    });

    console.log(`Pantalla actualizada: ${clave}`);
}*/
