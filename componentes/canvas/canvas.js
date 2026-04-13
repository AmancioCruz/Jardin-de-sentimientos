import { contenedores } from "../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../utilidades/constructor_elementos.js";

let margenLienzo = 0;

export function crearComponenteCanvas(margen) {
    margenLienzo = margen;
    const alto = contenedores.contenido.clientHeight;
    const ancho = contenedores.contenido.clientWidth;
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

    const contenedor = lienzo.parentElement || contenedores.contenido;

    lienzo.width = contenedor.clientWidth;
    lienzo.height = contenedor.clientHeight;

}

window.addEventListener('resize', ajustarLienzo);

