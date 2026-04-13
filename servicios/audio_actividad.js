import { obtenerSonidoActividad } from "./preferencias_locales.js";

const reproductorActividad = new Audio();

reproductorActividad.loop = true;
reproductorActividad.preload = 'auto';
reproductorActividad.volume = 0.35;

const sonidosDisponibles = new Set(['lluvia', 'bosque', 'olas']);

export function configurarAudioActividad(sonido = obtenerSonidoActividad()) {
    detenerAudioActividad();

    if (!sonidosDisponibles.has(sonido)) return;

    reproductorActividad.src = `./recursos/audio/${sonido}.mp3`;
    reproductorActividad.play().catch(() => {
        /* El navegador puede bloquear audio o el archivo puede no existir aun.
           La actividad debe continuar aunque la música no se reproduzca. */
    });
}

export function detenerAudioActividad() {
    reproductorActividad.pause();
    reproductorActividad.currentTime = 0;
}
