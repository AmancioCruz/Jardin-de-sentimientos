import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearConfiguracion } from "./configuracion.js";

registrarPantalla(seccionesApp.configuracion, {
    constructor: crearConfiguracion
});
