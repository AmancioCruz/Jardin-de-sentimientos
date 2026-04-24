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
        const canvasCompuesto = crearImagenCompuestaActividad({
            actividad,
            respuesta,
            comentario,
            fechaActividad
        });
        const imagen = await subirImagenActividad(usuario, actividad.nombreActividad, canvasCompuesto, fechaActividad);
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
        imagenCompuesta: true,
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

function crearImagenCompuestaActividad({ actividad = {}, respuesta = '', comentario = '', fechaActividad = new Date() }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1600;
    canvas.height = 900;

    const colores = {
        fondo: '#eef2e9',
        tarjeta: '#fffef9',
        panelImagen: '#f7f2e7',
        borde: 'rgba(22, 78, 63, 0.10)',
        sombra: 'rgba(22, 78, 63, 0.12)',
        titulo: '#164e3f',
        cuerpo: '#31584e',
        secundario: 'rgba(49, 88, 78, 0.72)'
    };

    dibujarRectanguloRedondeado(ctx, 0, 0, canvas.width, canvas.height, 0, colores.fondo);
    dibujarTarjetaConSombra(ctx, 36, 36, canvas.width - 72, canvas.height - 72, 34, colores.tarjeta, colores.sombra);

    const areaImagen = {
        x: 74,
        y: 74,
        w: 760,
        h: 752
    };
    dibujarRectanguloRedondeado(ctx, areaImagen.x, areaImagen.y, areaImagen.w, areaImagen.h, 28, colores.panelImagen);
    dibujarRectanguloRedondeado(ctx, areaImagen.x + 22, areaImagen.y + 22, areaImagen.w - 44, areaImagen.h - 44, 24, '#f2ebdc');

    dibujarCanvasActividadEnPanel(ctx, actividad.canvas, {
        x: areaImagen.x + 36,
        y: areaImagen.y + 36,
        w: areaImagen.w - 72,
        h: areaImagen.h - 72
    });

    const areaTextoX = 880;
    const areaTextoW = 620;
    const nombreActividad = formatearNombreActividadParaImagen(actividad.nombreActividad);
    const momentoHumano = formatearFechaHoraHumanaImagen(fechaActividad);
    const resumen = construirResumenImagenActividad(actividad, respuesta);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = colores.titulo;
    ctx.font = '800 64px sans-serif';
    dibujarTextoAjustado(ctx, nombreActividad, areaTextoX, 138, areaTextoW, 78, 2, colores.titulo);

    ctx.fillStyle = colores.secundario;
    ctx.font = '700 28px sans-serif';
    dibujarTextoAjustado(ctx, momentoHumano, areaTextoX, 286, areaTextoW, 40, 2, colores.secundario);

    ctx.fillStyle = colores.cuerpo;
    ctx.font = '700 28px sans-serif';
    dibujarTextoAjustado(ctx, resumen, areaTextoX, 382, areaTextoW, 46, 6, colores.cuerpo);

    if (comentario?.trim()) {
        ctx.fillStyle = colores.secundario;
        ctx.font = '600 24px sans-serif';
        dibujarTextoAjustado(
            ctx,
            `Tambien escribiste: "${comentario.trim()}".`,
            areaTextoX,
            640,
            areaTextoW,
            40,
            4,
            colores.secundario
        );
    }

    return canvas;
}

function dibujarCanvasActividadEnPanel(ctx, origen, area) {
    if (!origen) return;

    const anchoOrigen = origen.width || origen.videoWidth || origen.naturalWidth || area.w;
    const altoOrigen = origen.height || origen.videoHeight || origen.naturalHeight || area.h;
    const escala = Math.min(area.w / anchoOrigen, area.h / altoOrigen);
    const ancho = anchoOrigen * escala;
    const alto = altoOrigen * escala;
    const x = area.x + (area.w - ancho) / 2;
    const y = area.y + (area.h - alto) / 2;

    ctx.drawImage(origen, x, y, ancho, alto);
}

function dibujarTextoAjustado(ctx, texto, x, y, maxWidth, lineHeight, maxLineas, color) {
    const lineas = partirTextoEnLineas(ctx, texto, maxWidth, maxLineas);
    ctx.fillStyle = color;
    lineas.forEach((linea, indice) => {
        ctx.fillText(linea, x, y + (indice * lineHeight));
    });
}

function partirTextoEnLineas(ctx, texto, maxWidth, maxLineas = 4) {
    const palabras = String(texto || '').split(/\s+/).filter(Boolean);
    const lineas = [];
    let actual = '';

    palabras.forEach((palabra) => {
        const prueba = actual ? `${actual} ${palabra}` : palabra;
        if (ctx.measureText(prueba).width <= maxWidth) {
            actual = prueba;
            return;
        }

        if (actual) {
            lineas.push(actual);
        }
        actual = palabra;
    });

    if (actual) {
        lineas.push(actual);
    }

    if (lineas.length <= maxLineas) return lineas;

    const recortadas = lineas.slice(0, maxLineas);
    const ultima = recortadas[maxLineas - 1];
    recortadas[maxLineas - 1] = ultima.length > 3 ? `${ultima.slice(0, -3)}...` : `${ultima}...`;
    return recortadas;
}

function dibujarTarjetaConSombra(ctx, x, y, w, h, radio, color, sombra) {
    ctx.save();
    ctx.shadowColor = sombra;
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 16;
    dibujarRectanguloRedondeado(ctx, x, y, w, h, radio, color);
    ctx.restore();
}

function dibujarRectanguloRedondeado(ctx, x, y, w, h, radio, color) {
    ctx.beginPath();
    ctx.moveTo(x + radio, y);
    ctx.lineTo(x + w - radio, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radio);
    ctx.lineTo(x + w, y + h - radio);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radio, y + h);
    ctx.lineTo(x + radio, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radio);
    ctx.lineTo(x, y + radio);
    ctx.quadraticCurveTo(x, y, x + radio, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function construirResumenImagenActividad(actividad = {}, respuesta = '') {
    const actividadNombre = formatearNombreActividadParaImagen(actividad.nombreActividad);
    const contexto = actividad?.contexto || {};
    const respuestaLimpia = respuesta?.trim();

    if (contexto?.origen === 'evaluacion') {
        if (respuestaLimpia) {
            return `No sabías cómo te sentías, así que respondiste una evaluación breve. La app te sugirió ${actividadNombre} y al terminar respondiste: "${respuestaLimpia}".`;
        }

        return `No sabías cómo te sentías, así que respondiste una evaluación breve. La app te sugirió ${actividadNombre}.`;
    }

    if (contexto?.resumen) {
        return respuestaLimpia
            ? `${contexto.resumen} Al terminar respondiste: "${respuestaLimpia}".`
            : contexto.resumen;
    }

    const accion = obtenerResumenAccionImagen(actividad.nombreActividad);
    return respuestaLimpia
        ? `Guardaste este momento para ${accion}. Al terminar respondiste: "${respuestaLimpia}".`
        : `Guardaste este momento para ${accion}.`;
}

function obtenerResumenAccionImagen(nombreActividad = '') {
    const acciones = {
        tablero: 'ordenar lo que pensabas y sentías',
        juego: 'protegerte de lo que te estaba presiónando',
        respiracion: 'darte una pausa y recuperar el ritmo',
        pizarron: 'expresar tus ideas y sentimientos de forma visual'
    };

    return acciones[nombreActividad] || 'acompañar este momento';
}

function formatearNombreActividadParaImagen(nombre = '') {
    const nombres = {
        tablero: 'Tablero de ideas',
        juego: 'Protege tu flor',
        respiracion: 'Respiración guiada',
        pizarron: 'Pizarrón creativo'
    };

    return nombres[nombre] || nombre || 'Actividad';
}

function formatearFechaHoraHumanaImagen(fecha) {
    const fechaTexto = new Intl.DateTimeFormat('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(fecha);

    const horaTexto = new Intl.DateTimeFormat('es-MX', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(fecha);

    const fechaCapitalizada = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);
    return `${fechaCapitalizada} · ${horaTexto}`;
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


