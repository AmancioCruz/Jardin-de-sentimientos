import { crearInicio } from "./inicio.js";
import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";

registrarPantalla(seccionesApp.inicio, {
    constructor: crearInicio,
    dependencias: {
        callbacks: {}
    }
})