import { contenedores } from "../../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../../utilidades/constructor_elementos.js";
import { mostrarTutorialActividad } from "../../../componentes/tutorial_actividad/tutorial_actividad.js";
import { activarOverlay, desactivarOverlay } from "../../../servicios/overlay.js";

const duracionSesionSegundos = 180;
const fases = [
    { texto: 'Inhala', duracion: 4, clase: 'respiracion-inhala' },
    { texto: 'Sostén', duracion: 4, clase: 'respiracion-sosten' },
    { texto: 'Exhala', duracion: 4, clase: 'respiracion-exhala' },
    { texto: 'Pausa', duracion: 4, clase: 'respiracion-pausa' }
];

export function inicializarRespiracionGuiada({ alCompletar, alSalir } = {}) {
    let indiceFase = 0;
    let segundosRestantes = fases[indiceFase].duracion;
    let segundosSesion = duracionSesionSegundos;
    let sesionesCompletadas = 0;
    let intervalo = null;
    let iniciada = false;

    const vista = crearVistaRespiracion(() => salirSinGuardar());
    vista.montar(contenedores.contenido, true);

    const circulo = vista.nodo.querySelector('[data-circulo-respiracion]');
    const textoFase = vista.nodo.querySelector('[data-fase-respiracion]');
    const contador = vista.nodo.querySelector('[data-contador-respiracion]');
    const progreso = vista.nodo.querySelector('[data-progreso-respiracion]');
    const botonIniciar = vista.nodo.querySelector('[data-iniciar-respiracion]');
    const panelSesion = vista.nodo.querySelector('[data-panel-sesion-respiracion]');
    const textoPanelSesion = vista.nodo.querySelector('[data-texto-panel-sesion]');
    const botonMejor = vista.nodo.querySelector('[data-respiracion-mejor]');
    const botonOtra = vista.nodo.querySelector('[data-respiracion-otra]');
    const overlaySesion = document.createElement('div');

    overlaySesion.className = 'evaluacion-cierre-actividad respiracion-evaluacion-minuto oculto';
    panelSesion.classList.remove('oculto');
    overlaySesion.appendChild(panelSesion);
    document.body.appendChild(overlaySesion);

    function salirSinGuardar() {
        destruir();
        if (typeof alSalir === 'function') alSalir();
    }

    function limpiar() {
        clearInterval(intervalo);
        intervalo = null;
    }

    function destruir() {
        limpiar();
        overlaySesion?.remove();
        desactivarOverlay('respiracion-sesion');
    }

    function mostrarFase() {
        const fase = fases[indiceFase];

        circulo.classList.remove(...fases.map((item) => item.clase));
        circulo.classList.add(fase.clase);
        textoFase.textContent = fase.texto;
        contador.textContent = segundosRestantes;
        progreso.textContent = `Sesión ${sesionesCompletadas + 1} | ${segundosSesion}s`;
    }

    function avanzar() {
        segundosRestantes -= 1;
        segundosSesion -= 1;

        if (segundosRestantes <= 0) {
            indiceFase = (indiceFase + 1) % fases.length;
            segundosRestantes = fases[indiceFase].duracion;
        }

        if (segundosSesion <= 0) {
            completarSesion();
            return;
        }

        mostrarFase();
    }

    function iniciar() {
        if (iniciada) return;

        iniciada = true;
        botonIniciar.disabled = true;
        botonIniciar.classList.add('respiracion-boton-iniciado');
        botonIniciar.innerHTML = '<i class="fa-solid fa-seedling"></i> Respirando';
        overlaySesion.classList.add('oculto');
        desactivarOverlay('respiracion-sesion');
        vista.nodo.classList.remove('respiracion-sesion-completa');
        mostrarFase();
        intervalo = setInterval(avanzar, 1000);
    }

    function completarSesion() {
        limpiar();
        sesionesCompletadas += 1;
        iniciada = false;
        botonIniciar.disabled = true;
        botonIniciar.classList.add('oculto');
        circulo.classList.remove(...fases.map((item) => item.clase));
        textoFase.textContent = 'Sesión completada';
        contador.textContent = sesionesCompletadas;
        progreso.textContent = `${sesionesCompletadas} sesión(es) completada(s)`;

        textoPanelSesion.textContent = 'Terminaste una sesión de respiración 4x4. ¿Cómo te sientes ahora?';
        overlaySesion.classList.remove('oculto');
        activarOverlay('respiracion-sesion');
        vista.nodo.classList.add('respiracion-sesion-completa');
    }

    function iniciarOtraSesion() {
        indiceFase = 0;
        segundosRestantes = fases[indiceFase].duracion;
        segundosSesion = duracionSesionSegundos;
        overlaySesion.classList.add('oculto');
        desactivarOverlay('respiracion-sesion');
        vista.nodo.classList.remove('respiracion-sesion-completa');
        mostrarFase();
        iniciar();
    }

    function completarRespiracion() {
        destruir();
        if (typeof alCompletar === 'function') {
            alCompletar({
                sesiones: sesionesCompletadas,
                duracionTotalSegundos: sesionesCompletadas * duracionSesionSegundos
            });
        }
    }

    botonIniciar.addEventListener('click', iniciar);
    botonMejor.addEventListener('click', completarRespiracion);
    botonOtra.addEventListener('click', iniciarOtraSesion);
    mostrarFase();
    mostrarTutorialActividad({
        id: 'respiracion-guiada',
        titulo: 'Guía rápida de respiración',
        descripcion: 'La respiración 4x4 usa cuatro tiempos iguales: inhalar, sostener, exhalar y pausar. Cada sesión dura 3 minutos.',
        pasos: [
            { icono: 'fa-solid fa-play', texto: 'Inicia para seguir el ritmo del círculo.' },
            { icono: 'fa-solid fa-square', texto: 'Inhala 4, sostén 4, exhala 4 y pausa 4.' },
            { icono: 'fa-solid fa-seedling', texto: 'Practicarlo varias veces ayuda a que el ritmo se sienta más familiar.' },
            { icono: 'fa-solid fa-repeat', texto: 'Puedes repetir la sesión las veces que necesites.' },
            { icono: 'fa-solid fa-check', texto: 'La actividad se guarda cuando completas la sesión y respondes la evaluación final.' }
        ]
    });

    return destruir;
}

function crearVistaRespiracion(alSalir) {
    return construirElemento({
        tipo: 'section',
        atributos: { class: 'actividad-respiracion' },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'respiracion-tarjeta' },
                hijos: [
                    { tipo: 'h1', hijos: ['Respiración 4x4'] },
                    {
                        tipo: 'p',
                        hijos: ['Inhala 4 segundos, sostén 4, exhala 4 y haz una pausa de 4. El ritmo del círculo te acompaña paso a paso, y no tiene que salir perfecto: practicarlo varias veces ayuda a que sea más fácil volver a este ritmo cuando lo necesites.']
                    },
                    {
                        tipo: 'div',
                        atributos: {
                            class: 'respiracion-circulo',
                            'data-circulo-respiracion': ''
                        },
                        hijos: [
                            {
                                tipo: 'span',
                                atributos: { 'data-fase-respiracion': '' },
                                hijos: ['Inhala']
                            },
                            {
                                tipo: 'strong',
                                atributos: { 'data-contador-respiracion': '' },
                                hijos: ['4']
                            }
                        ]
                    },
                    {
                        tipo: 'p',
                        atributos: { class: 'respiracion-progreso', 'data-progreso-respiracion': '' },
                        hijos: [`Sesión 1 | ${duracionSesionSegundos}s`]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'respiracion-panel-sesion oculto', 'data-panel-sesion-respiracion': '' },
                        hijos: [
                            {
                                tipo: 'p',
                                atributos: { 'data-texto-panel-sesion': '' },
                                hijos: ['Terminaste una sesión de respiración 4x4. ¿Cómo te sientes ahora?']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'respiracion-panel-sesion__acciones' },
                                hijos: [
                                    {
                                        tipo: 'button',
                                        atributos: { type: 'button', class: 'btn-actividad-salir', 'data-respiracion-mejor': '' },
                                        hijos: [
                                            { tipo: 'i', atributos: { class: 'fa-solid fa-seedling' } },
                                            'Me siento más tranquilo'
                                        ]
                                    },
                                    {
                                        tipo: 'button',
                                        atributos: { type: 'button', class: 'btn-pizarron-mini', 'data-respiracion-otra': '' },
                                        hijos: [
                                            { tipo: 'i', atributos: { class: 'fa-solid fa-repeat' } },
                                            'Quiero respirar otra vez'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'respiracion-acciones' },
                        hijos: [
                            {
                                tipo: 'button',
                                atributos: {
                                    type: 'button',
                                    class: 'btn-actividad-salir',
                                    'data-iniciar-respiracion': ''
                                },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-play' } },
                                    'Iniciar'
                                ]
                            },
                            {
                                tipo: 'button',
                                atributos: { type: 'button', class: 'btn-pizarron-mini' },
                                eventos: { click: alSalir },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-xmark' } },
                                    'Salir'
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}
