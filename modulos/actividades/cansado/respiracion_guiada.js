import { contenedores } from "../../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../../utilidades/constructor_elementos.js";
import { mostrarTutorialActividad } from "../../../componentes/tutorial_actividad/tutorial_actividad.js";

const duracionSesionSegundos = 60;
const fases = [
    { texto: 'Inhala', duracion: 4, clase: 'respiracion-inhala' },
    { texto: 'Sostén', duracion: 2, clase: 'respiracion-sosten' },
    { texto: 'Exhala', duracion: 6, clase: 'respiracion-exhala' }
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
        botonIniciar.innerHTML = '<i class="fa-solid fa-seedling"></i> En curso';
        overlaySesion.classList.add('oculto');
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
        textoFase.textContent = 'Pausa completada';
        contador.textContent = sesionesCompletadas;
        progreso.textContent = `${sesionesCompletadas} sesión(es) completada(s)`;

        textoPanelSesion.textContent = 'Terminaste un minuto de respiración. ¿Cómo te sientes ahora?';
        overlaySesion.classList.remove('oculto');
        vista.nodo.classList.add('respiracion-sesion-completa');
    }

    function iniciarOtraSesion() {
        indiceFase = 0;
        segundosRestantes = fases[indiceFase].duracion;
        segundosSesion = duracionSesionSegundos;
        overlaySesion.classList.add('oculto');
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
        descripcion: 'Cada sesión dura un minuto. Al terminar puedes decidir si ya estás mejor o si necesitas respirar otra vez.',
        pasos: [
            { icono: 'fa-solid fa-play', texto: 'Iniciar activa el ritmo de respiración.' },
            { icono: 'fa-solid fa-circle', texto: 'El círculo te indica cuándo inhalar, sostener y exhalar.' },
            { icono: 'fa-solid fa-repeat', texto: 'Puedes repetir el minuto hasta sentirte más tranquilo.' },
            { icono: 'fa-solid fa-check', texto: 'Solo se guarda cuando completas la pausa y respondes la evaluación final.' }
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
                    { tipo: 'h1', hijos: ['Pausa para descansar'] },
                    {
                        tipo: 'p',
                        hijos: ['Sigue el ritmo del círculo. No tienes que hacerlo perfecto, solo acompaña tu respiración.']
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
                        hijos: ['Sesión 1 | 60s']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'respiracion-panel-sesion oculto', 'data-panel-sesion-respiracion': '' },
                        hijos: [
                            {
                                tipo: 'p',
                                atributos: { 'data-texto-panel-sesion': '' },
                                hijos: ['Terminaste un minuto de respiración. ¿Cómo te sientes ahora?']
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
                                            'Estoy más tranquilo'
                                        ]
                                    },
                                    {
                                        tipo: 'button',
                                        atributos: { type: 'button', class: 'btn-pizarron-mini', 'data-respiracion-otra': '' },
                                        hijos: [
                                            { tipo: 'i', atributos: { class: 'fa-solid fa-repeat' } },
                                            'Necesito respirar otra vez'
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
