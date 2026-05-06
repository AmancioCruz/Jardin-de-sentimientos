import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearRecursosApoyo } from "./recursos_apoyo.js";

registrarPantalla(seccionesApp.recursos, {
    constructor: crearRecursosApoyo,
    dependencias: {
        alSalir: () => mostrarPantalla(seccionesApp.inicio)
    }
});
