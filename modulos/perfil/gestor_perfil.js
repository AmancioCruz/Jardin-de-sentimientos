import { crearPerfil } from "./perfil.js";
import { registrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";

registrarPantalla(seccionesApp.perfil, {
    constructor: crearPerfil
})

/**
 * registrarPantalla(seccionesApp.inicio, {
     constructor:,
     dependencias: {
         callbacks: {}
     }
 })
 */