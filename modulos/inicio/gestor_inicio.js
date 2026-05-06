import { crearInicio } from "./inicio.js";
import { registrarPantalla, mostrarPantalla } from "../../nucleo/gestor_pantallas.js";
import { seccionesApp } from "../../nucleo/sistema_estados.js";
import { crearEvaluacion } from "../../componentes/evaluacion/evaluacion.js";
import { contenedores } from "../../nucleo/contenedores_dom.js";
import { activarOverlay, desactivarOverlay } from "../../servicios/overlay.js";
import { crearComponenteCanvas } from "../../componentes/canvas/canvas.js";
import { subirImagenActividad } from "../../servicios/almacenamiento.js";
import { registrarActividadUsuario } from "../../servicios/base_datos.js";
import { inicializarTablero } from "../../modulos/actividades/coordinador_actividades.js";
import { finalizarTableroActivo, obtenerOCrearTableroActivo, obtenerTableroActivo } from "../../modulos/actividades/tablero/estado_tablero.js";
import { inicializarJuegoFlores } from "../../modulos/actividades/ansioso/juego_flores.js";
import { inicializarRespiracionGuiada } from "../../modulos/actividades/cansado/respiracion_guiada.js";
import { inicializarPizarronCreativo } from "../../modulos/actividades/pizarron/pizarron_creativo.js";
import { configurarAudioActividad, detenerAudioActividad } from "../../servicios/audio_actividad.js";

let actividadEnCurso = false;
let limpiarActividadActual = null;
window.addEventListener('actividad:finalizada-sin-guardar', limpiarActividadSinGuardar);

const datosEvaluacion = {
    titulo: "Revisión rápida",
    instruccion: "Del 1 al 5, marca qué tanto se parece cada frase a cómo te sientes ahora.",
    escala: {
        minimo: 1,
        maximo: 5,
        etiquetas: {
            izquierda: "Nada",
            derecha: "Mucho"
        }
    },
    preguntas: [
        { id: "estres", texto: "Me siento abrumado por lo que tengo en mente." },
        { id: "concentracion", texto: "Me cuesta concentrarme." },
        { id: "cansancio", texto: "Me siento cansado." },
        { id: "ansiedad", texto: "Me siento inquieto o nervioso." },
        { id: "tiempo", texto: "Siento que el tiempo no me alcanza." },
        { id: "orden", texto: "Me cuesta ordenar mis ideas." }
    ]
};

const definicionesActividad = {
    'Saturado Mentalmente': {
        nombreActividad: 'tablero',
        nombreVisible: 'Tablero de ideas',
        seleccion: 'Tengo la mente saturada'
    },
    'Ansioso': {
        nombreActividad: 'juego',
        nombreVisible: 'Protege tu flor',
        seleccion: 'Me siento bajo presión'
    },
    'Cansado': {
        nombreActividad: 'respiracion',
        nombreVisible: 'Respiración guiada',
        seleccion: 'Necesito una pausa'
    },
    'Pizarrón Creativo': {
        nombreActividad: 'pizarron',
        nombreVisible: 'Pizarrón creativo',
        seleccion: 'No me puedo concentrar'
    }
};

registrarPantalla(seccionesApp.inicio, {
    constructor: crearInicio,
    dependencias: {
        callbacks: {
            alSeleccionarEstado: (estado, usuario) => manejarEstados(estado, usuario, crearContextoEleccion(estado)),
            alNoEstoySeguro: (usuario) => manejarNoEstoySeguro(usuario),
            alAbrirRecursos: (usuario) => mostrarPantalla(seccionesApp.recursos, usuario)
        }
    }
});

function manejarEstados(estado, usuario, contexto = null) {
    if (estado === 'Saturado Mentalmente') {
        obtenerOCrearTableroActivo({ estado });
        abrirTablero(usuario, contexto);
        return;
    }

    if (estado === 'Ansioso') {
        abrirJuegoFlores(usuario, contexto);
        return;
    }

    if (estado === 'Cansado') {
        abrirRespiracionGuiada(usuario, contexto);
        return;
    }

    if (estado === 'Pizarrón Creativo') {
        abrirPizarronCreativo(usuario, contexto);
    }
}

export function abrirTablero(usuario = null, contexto = null) {
    const lienzo = crearComponenteCanvas(25);

    activarModoActividad(usuario);

    registrarLimpiezaActividad(inicializarTablero(lienzo, {
        tablero: obtenerTableroActivo(),
        alGuardar: (canvas) => mostrarEvaluacionCierre(usuario, {
            nombreActividad: 'tablero',
            canvas,
            contexto
        }),
        alSalir: () => salirAInicio(usuario)
    }));
}

function abrirJuegoFlores(usuario = null, contexto = null) {
    activarModoActividad(usuario);
    registrarLimpiezaActividad(inicializarJuegoFlores({
        alCompletar: (canvas) => mostrarEvaluacionCierre(usuario, {
            nombreActividad: 'juego',
            canvas,
            contexto
        }),
        alSalir: () => salirAInicio(usuario)
    }));
}

function abrirRespiracionGuiada(usuario = null, contexto = null) {
    activarModoActividad(usuario);
    registrarLimpiezaActividad(inicializarRespiracionGuiada({
        alCompletar: (datosRespiracion) => mostrarEvaluacionCierre(usuario, {
            nombreActividad: 'respiracion',
            canvas: crearImagenResumenActividad('Respiración guiada', `${datosRespiracion.sesiones} pausa(s) completada(s)`),
            contexto
        }),
        alSalir: () => salirAInicio(usuario)
    }));
}

function abrirPizarronCreativo(usuario = null, contexto = null) {
    activarModoActividad(usuario);
    registrarLimpiezaActividad(inicializarPizarronCreativo({
        alGuardar: (canvas) => mostrarEvaluacionCierre(usuario, {
            nombreActividad: 'pizarron',
            canvas,
            contexto
        }),
        alSalir: () => salirAInicio(usuario)
    }));
}

function activarModoActividad(usuario = null) {
    ejecutarLimpiezaActividadActual();
    actividadEnCurso = true;
    document.body.classList.add('actividad-activa');
    contenedores.contenido.classList.add('actividad-activa');
    window.addEventListener('beforeunload', avisarAntesDeRecargar);
    window.addEventListener('pagehide', limpiarDatosAlCerrarPagina);
    configurarAudioActividad();
}

function salirAInicio(usuario = null) {
    ejecutarLimpiezaActividadActual();
    limpiarDatosActividadTemporal();
    desactivarProteccionActividad();
    document.getElementById('evaluacion-cierre-actividad')?.remove();
    desactivarOverlay('evaluacion-cierre-actividad');
    document.body.classList.remove('actividad-activa');
    contenedores.contenido.classList.remove('actividad-activa');
    mostrarPantalla(seccionesApp.inicio, usuario);
}

function avisarAntesDeRecargar(evento) {
    if (!actividadEnCurso) return;

    evento.preventDefault();
    evento.returnValue = '';
}

function desactivarProteccionActividad() {
    actividadEnCurso = false;
    window.removeEventListener('beforeunload', avisarAntesDeRecargar);
    window.removeEventListener('pagehide', limpiarDatosAlCerrarPagina);
    detenerAudioActividad();
}

function registrarLimpiezaActividad(limpiador) {
    limpiarActividadActual = typeof limpiador === 'function' ? limpiador : null;
}

function ejecutarLimpiezaActividadActual() {
    if (typeof limpiarActividadActual === 'function') {
        limpiarActividadActual();
    }

    limpiarActividadActual = null;
    document.getElementById('tutorial-actividad')?.remove();
    document.getElementById('panel-texto-nota')?.remove();
    document.querySelectorAll('.fantasma-sticker').forEach((fantasma) => fantasma.remove());
}

function limpiarActividadSinGuardar() {
    ejecutarLimpiezaActividadActual();
    limpiarDatosActividadTemporal();
    desactivarProteccionActividad();
    document.getElementById('evaluacion-cierre-actividad')?.remove();
    desactivarOverlay('evaluacion-cierre-actividad');
    document.body.classList.remove('actividad-activa');
    contenedores.contenido.classList.remove('actividad-activa');
}

function limpiarDatosActividadTemporal() {
    finalizarTableroActivo();
}

function limpiarDatosAlCerrarPagina() {
    if (!actividadEnCurso) return;

    limpiarDatosActividadTemporal();
}

function mostrarEvaluacionCierre(usuario = null, actividad = {}) {
    document.getElementById('evaluacion-cierre-actividad')?.remove();
    desactivarOverlay('evaluacion-cierre-actividad');

    const opciones = [
        { texto: 'Me siento más tranquilo', icono: 'fa-solid fa-seedling' },
        { texto: 'Me siento igual', icono: 'fa-solid fa-minus' },
        { texto: 'Necesito otra pausa', icono: 'fa-solid fa-heart' }
    ];
    const evaluacion = construirEvaluacionCierre(opciones, async ({ respuesta, comentario }) => {
        await guardarRegistroActividad(usuario, actividad, respuesta, comentario);
        salirAInicio(usuario);
    });

    document.body.appendChild(evaluacion);
    activarOverlay('evaluacion-cierre-actividad');
}

function construirEvaluacionCierre(opciones, alContinuar) {
    const contenedor = document.createElement('div');
    contenedor.id = 'evaluacion-cierre-actividad';
    contenedor.className = 'evaluacion-cierre-actividad';

    contenedor.innerHTML = `
        <div class="evaluacion-cierre-actividad__tarjeta" role="dialog" aria-modal="true" aria-labelledby="evaluacion-cierre-titulo">
            <h2 id="evaluacion-cierre-titulo">¿Cómo te sientes ahora?</h2>
            <label class="evaluacion-cierre-actividad__comentario">
                <span>Comentario opcional</span>
                <textarea rows="3" maxlength="240" placeholder="Puedes escribir algo breve sobre este momento."></textarea>
            </label>
            <p>Elige una opción para guardar tu actividad.</p>
            <div class="evaluacion-cierre-actividad__opciones"></div>
        </div>
    `;

    const grupoOpciones = contenedor.querySelector('.evaluacion-cierre-actividad__opciones');
    const comentario = contenedor.querySelector('textarea');

    opciones.forEach((opcion) => {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'evaluacion-cierre-actividad__opcion';
        boton.innerHTML = `<i class="${opcion.icono}"></i><span>${opcion.texto}</span>`;
        boton.addEventListener('click', async () => {
            grupoOpciones.querySelectorAll('button').forEach((item) => {
                item.disabled = true;
            });
            boton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Guardando...</span>';
            await alContinuar({
                respuesta: opcion.texto,
                comentario: comentario?.value?.trim() || ''
            });
        });
        grupoOpciones.appendChild(boton);
    });

    return contenedor;
}

async function guardarRegistroActividad(usuario, actividad = {}, respuesta = '', comentario = '') {
    if (!usuario?.uid || !actividad.canvas) return null;

    const fechaActividad = new Date();

    try {
        const imagen = await subirImagenActividad(usuario, actividad.nombreActividad, actividad.canvas, fechaActividad);
        const registro = crearDatosRegistroActividad({
            nombreActividad: actividad.nombreActividad,
            respuesta,
            comentario,
            imagen,
            fechaActividad,
            contexto: actividad.contexto
        });

        await registrarActividadUsuario(usuario.uid, registro);

        return registro;
    } catch (error) {
        console.error("No se pudo guardar el registro de la actividad:", error);
        return null;
    }
}

function crearDatosRegistroActividad({ nombreActividad, respuesta, comentario, imagen, fechaActividad, contexto }) {
    const { fecha, hora } = obtenerFechaHoraLegible(fechaActividad);

    return {
        nombreActividad,
        respuesta,
        comentario: comentario || '',
        fecha,
        hora,
        imagenPath: imagen?.ruta || '',
        imagenUrl: imagen?.url || '',
        imagenCompuesta: false,
        creadoEn: fechaActividad.getTime(),
        contexto: normalizarContextoRegistro(contexto)
    };
}

function obtenerFechaHoraLegible(fecha) {
    const pad = (valor) => String(valor).padStart(2, '0');

    return {
        fecha: [
            fecha.getFullYear(),
            pad(fecha.getMonth() + 1),
            pad(fecha.getDate())
        ].join('-'),
        hora: [
            pad(fecha.getHours()),
            pad(fecha.getMinutes()),
            pad(fecha.getSeconds())
        ].join(':')
    };
}

function crearImagenResumenActividad(titulo, subtitulo = 'Pausa completada') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 900;
    canvas.height = 1200;
    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#164e3f';
    ctx.font = '800 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titulo, canvas.width / 2, 480);
    ctx.fillStyle = 'rgba(30, 49, 43, 0.72)';
    ctx.font = '700 34px sans-serif';
    ctx.fillText(subtitulo, canvas.width / 2, 560);
    ctx.fillText('Respira profundo y vuelve cuando lo necesites.', canvas.width / 2, 620);

    return canvas;
}

function manejarNoEstoySeguro(usuario = null) {
    const evaluacion = crearEvaluacion(datosEvaluacion, (respuestas) => {
        const estadoSugerido = obtenerEstadoSugerido(respuestas);
        manejarEstados(estadoSugerido, usuario, crearContextoEvaluacion(respuestas, estadoSugerido));
    });
    evaluacion.montar(contenedores.contenido, true);
}

function obtenerEstadoSugerido(respuestas) {
    const mapaEstados = {
        estres: 'Saturado Mentalmente',
        concentracion: 'Pizarrón Creativo',
        cansancio: 'Cansado',
        ansiedad: 'Ansioso',
        tiempo: 'Saturado Mentalmente',
        orden: 'Pizarrón Creativo'
    };
    const entradaMayor = Object.entries(respuestas)
        .sort(([, valorA], [, valorB]) => valorB - valorA)[0];

    return mapaEstados[entradaMayor?.[0]] || 'Saturado Mentalmente';
}

function crearContextoEleccion(estado = '') {
    const definicion = obtenerDefinicionActividadPorEstado(estado);
    if (!definicion) return null;

    return {
        origen: 'eleccion',
        resumen: `Elegiste "${definicion.seleccion}", por eso usaste ${definicion.nombreVisible}.`
    };
}

function crearContextoEvaluacion(respuestas = {}, estadoSugerido = '') {
    const definicion = obtenerDefinicionActividadPorEstado(estadoSugerido);
    const aspectos = obtenerAspectosDominantesEvaluacion(respuestas);
    const preguntas = datosEvaluacion.preguntas.map((pregunta) => ({
        id: pregunta.id,
        texto: pregunta.texto,
        respuesta: Number(respuestas?.[pregunta.id] || 0)
    }));

    return {
        origen: 'evaluacion',
        resumen: definicion
            ? `No sabías cómo te sentías, así que respondiste una evaluación breve. Lo que más apareció fue ${unirAspectosEvaluacion(aspectos)}, por eso la app te sugirió ${definicion.nombreVisible}.`
            : 'No sabías cómo te sentías, así que respondiste una evaluación breve para encontrar una actividad que pudiera ayudarte.',
        evaluacion: {
            actividadSugerida: definicion?.nombreActividad || '',
            respuestas: { ...respuestas },
            preguntas
        }
    };
}

function obtenerAspectosDominantesEvaluacion(respuestas = {}) {
    const etiquetas = {
        estres: 'presión',
        concentracion: 'dificultad para concentrarte',
        cansancio: 'cansancio',
        ansiedad: 'inquietud',
        tiempo: 'falta de tiempo',
        orden: 'dificultad para ordenar ideas'
    };

    const valores = Object.values(respuestas).map((valor) => Number(valor) || 0);
    const maximo = Math.max(...valores, 0);
    const dominantes = Object.entries(respuestas)
        .filter(([, valor]) => Number(valor) === maximo && maximo > 0)
        .map(([clave]) => etiquetas[clave])
        .filter(Boolean);

    return dominantes.length ? dominantes : ['lo que estabas viviendo'];
}

function unirAspectosEvaluacion(aspectos = []) {
    if (aspectos.length <= 1) return aspectos[0] || 'lo que estabas viviendo';
    if (aspectos.length === 2) return `${aspectos[0]} y ${aspectos[1]}`;
    return `${aspectos.slice(0, -1).join(', ')} y ${aspectos[aspectos.length - 1]}`;
}

function normalizarContextoRegistro(contexto = null) {
    if (!contexto || typeof contexto !== 'object') return null;

    const normalizado = {
        origen: contexto.origen || 'eleccion',
        resumen: contexto.resumen || ''
    };

    if (contexto.origen === 'evaluacion' && contexto.evaluacion) {
        normalizado.evaluacion = {
            actividadSugerida: contexto.evaluacion.actividadSugerida || '',
            respuestas: { ...(contexto.evaluacion.respuestas || {}) },
            preguntas: Array.isArray(contexto.evaluacion.preguntas) ? contexto.evaluacion.preguntas : []
        };
    }

    return normalizado;
}

function obtenerDefinicionActividadPorEstado(estado = '') {
    if (definicionesActividad[estado]) {
        return definicionesActividad[estado];
    }

    if (estado.includes('Saturado')) return definicionesActividad['Saturado Mentalmente'];
    if (estado.includes('Ansioso')) return definicionesActividad['Ansioso'];
    if (estado.includes('Cansado')) return definicionesActividad['Cansado'];
    if (estado.toLowerCase().includes('pizarr')) {
        return {
            nombreActividad: 'pizarron',
            nombreVisible: 'Pizarrón creativo',
            seleccion: 'No me puedo concentrar'
        };
    }

    return null;
}


