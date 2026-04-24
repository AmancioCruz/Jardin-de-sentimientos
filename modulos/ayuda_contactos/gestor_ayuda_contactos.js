import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearAyudaContactos } from "./ayuda_contactos.js";

registrarPantalla(seccionesApp.ayuda, {
    constructor: crearAyudaContactos
});
