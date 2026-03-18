import { crearRegistro } from "./registro.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../../nucleo/sistema_estados.js";


function manejarRegistro() {

}

function manejarTerminos() {

}

function eventoFoto() {

}

registrarPantalla(seccionesApp.registro, {
    constructor: crearRegistro,
    dependencias: {
        alEnviar: manejarRegistro,
        alVerTerminos: manejarTerminos,
        alIrAInicioSesion: () => mostrarPantalla(seccionesApp.inicioSesion),
        eventoFoto: (e) => manejarFotografia(e)
    }
})

/*
registrarPantalla(seccionesApp.registro, () => {
    return crearRegistro({
        alEnviar: manejarRegistro,
        alVerTerminos: manejarTerminos,
        alIrAInicioSesion: () => mostrarPantalla(seccionesApp.inicioSesion),
        eventoFoto: (e) => manejarFotografia(e)
    })
});*/