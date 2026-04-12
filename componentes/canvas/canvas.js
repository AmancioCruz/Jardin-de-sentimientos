import { contenedores } from "../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../utilidades/constructor_elementos.js";

let margenLienzo = 0;

export function crearComponenteCanvas(margen) {
    margenLienzo = margen;
    const alto = contenedores.contenido.clientHeight - margenLienzo;
    const ancho = contenedores.contenido.clientWidth - margenLienzo;
    return construirElemento({
        tipo: 'canvas',
        atributos: {
            class: 'lienzo-base',
            id: 'lienzo',
            width: ancho,
            height: alto
        }
    })
}

function ajustarLienzo() {
    const lienzo = document.querySelector('#lienzo');

    if (!lienzo) return;

    lienzo.width = contenedores.contenido.clientWidth - margenLienzo;
    lienzo.height = contenedores.contenido.clientHeight -margenLienzo;


}

window.addEventListener('resize', ajustarLienzo);

