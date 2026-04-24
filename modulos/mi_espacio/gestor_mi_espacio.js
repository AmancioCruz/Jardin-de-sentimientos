import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearMiEspacio } from "./mi_espacio.js";

registrarPantalla(seccionesApp.espacio, {
    constructor: crearMiEspacio
});
