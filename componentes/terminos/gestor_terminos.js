import { crearConsentimiento } from "./terminos.js";
import { consentimientoData } from "./datos.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";

export function componenteTerminos() {
    const terminos = crearConsentimiento({
        consentimientoData: consentimientoData,
        alRegresar: manejarRegreso
    });

    terminos.montar(contenedores.contenido);
    return terminos;
}

function manejarRegreso() {
    const elemento = document.querySelector('#contenedor-consentimiento');
    console.log('regresar', elemento);
    elemento.remove();
    //mostrarPantalla(seccionesApp.registro);
}