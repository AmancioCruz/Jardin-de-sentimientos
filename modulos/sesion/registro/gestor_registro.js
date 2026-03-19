import { crearRegistro } from "./registro.js";
import { mostrarPantalla, registrarPantalla } from "../../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../../nucleo/sistema_estados.js";
import { registrarUsuario } from "../../../servicios/coordinador_servicios.js";
import { componenteTerminos } from "../../../componentes/terminos/gestor_terminos.js";


async function manejarRegistro(datos) {
    if (datos.foto.type !== "image/png" &&
        datos.foto.type !== "image/jpeg" &&
        datos.foto.type !== "image/webp"
    ) {
        datos.foto = await crearArchivoPorDefecto();
    }
    await registrarUsuario(datos);
    window.location.reload();
}

function manejarTerminos() {
    console.log('terminos');
    componenteTerminos();
}

function manejarFotografia(e) {
    const imagen = e.target.files[0];
    if (imagen.type === "image/png" ||
        imagen.type === "image/jpeg" ||
        imagen.type === "image/webp") {
        const lector = new FileReader();
        lector.onload = (dato) => {
            const url = dato.target.result;
            document.querySelector('#imagen-seleccionada').src = url;
        }
        lector.readAsDataURL(imagen);
    }
    else {
        alert('La imagen debe ser png, webp o jpg')
    }
}

async function crearArchivoPorDefecto() {
    const url = '../../../recursos/imagenes/default.webp';

    const respuesta = await fetch(url);
    const blob = await respuesta.blob();

    return new File([blob], 'default_perfil.png', {
        type: 'image/png'
    });
}

async function crearImagen(archivo) {
    return new Promise((resolve) => {
        const lector = new FileReader();
        lector.onload = (elemento) => {
            const img = new Image();
            img.src = elemento.target.result;
            img.onload = () =>
                resolve(img);
        }
        lector.readAsDataURL(archivo);
    })
}

registrarPantalla(seccionesApp.registro, {
    constructor: crearRegistro,
    dependencias: {
        alEnviar: (datos) => manejarRegistro(datos),
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