import { contenedores } from "../../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../../utilidades/constructor_elementos.js";
import { mostrarTutorialActividad } from "../../../componentes/tutorial_actividad/tutorial_actividad.js";

const fases = [
    { texto: 'Inhala', duracion: 4, clase: 'respiracion-inhala' },
    { texto: 'Sostén', duracion: 2, clase: 'respiracion-sosten' },
    { texto: 'Exhala', duracion: 6, clase: 'respiracion-exhala' }
];

export function inicializarRespiracionGuiada({ alSalir } = {}) {
    let indiceFase = 0;
    let segundosRestantes = fases[indiceFase].duracion;
    let intervalo = null;
    let iniciada = false;

    const vista = crearVistaRespiracion(() => finalizar());
    vista.montar(contenedores.contenido, true);

    const circulo = vista.nodo.querySelector('[data-circulo-respiracion]');
    const textoFase = vista.nodo.querySelector('[data-fase-respiracion]');
    const contador = vista.nodo.querySelector('[data-contador-respiracion]');
    const botonIniciar = vista.nodo.querySelector('[data-iniciar-respiracion]');

    function finalizar() {
        limpiar();
        if (typeof alSalir === 'function') alSalir();
    }

    function limpiar() {
        clearInterval(intervalo);
        intervalo = null;
    }

    function mostrarFase() {
        const fase = fases[indiceFase];

        circulo.classList.remove(...fases.map((item) => item.clase));
        circulo.classList.add(fase.clase);
        textoFase.textContent = fase.texto;
        contador.textContent = segundosRestantes;
    }

    function avanzar() {
        segundosRestantes -= 1;

        if (segundosRestantes <= 0) {
            indiceFase = (indiceFase + 1) % fases.length;
            segundosRestantes = fases[indiceFase].duracion;
        }

        mostrarFase();
    }

    function iniciar() {
        if (iniciada) return;

        iniciada = true;
        botonIniciar.disabled = true;
        botonIniciar.classList.add('respiracion-boton-iniciado');
        botonIniciar.innerHTML = '<i class="fa-solid fa-seedling"></i> En curso';
        mostrarFase();
        intervalo = setInterval(avanzar, 1000);
    }

    botonIniciar.addEventListener('click', iniciar);
    mostrarFase();
    mostrarTutorialActividad({
        id: 'respiracion-guiada',
        titulo: 'Guía rápida de respiración',
        descripcion: 'Usa esta pausa para recuperar energía sin exigirte hacerlo perfecto.',
        pasos: [
            { icono: 'fa-solid fa-play', texto: 'Iniciar activa el ritmo de respiración.' },
            { icono: 'fa-solid fa-circle', texto: 'El círculo te indica cuándo inhalar, sostener y exhalar.' },
            { icono: 'fa-solid fa-check', texto: 'Terminar abre una pregunta breve sobre cómo te sientes.' }
        ]
    });

    return limpiar;
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
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-check' } },
                                    'Terminar'
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}
