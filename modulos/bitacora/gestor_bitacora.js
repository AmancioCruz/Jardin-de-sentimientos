import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { mostrarBitacora } from "./bitacora.js";

registrarPantalla(seccionesApp.bitacora, {
    constructor: (dependencias) => mostrarBitacora(dependencias)
});
