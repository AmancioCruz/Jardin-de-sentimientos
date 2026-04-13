import { Nota } from "./nota.js";
import { actualizarNotasTableroActivo } from "./estado_tablero.js";

const notas = [];
const maximoNotas = 3;
const tamanoNotaInicial = {
    ancho: 180,
    alto: 155
};
const limitesTamanoNota = {
    anchoMinimo: 145,
    altoMinimo: 125,
    anchoMaximo: 240,
    altoMaximo: 210
};
let arrastre = null;
let arrastrePrioridad = null;
let lienzoActivo = null;
let canvasConEventos = null;
let alCambiarPrioridades = null;
let alCambiarSeleccion = null;
let alCambiarNotas = null;
let alEditarNota = null;
let indiceNotaSeleccionada = -1;
let indiceNotaEnEdicion = -1;
let prioridadSeleccionada = '';

export function agregarNota({ prioridad = '' } = {}) {
    if (notas.length >= maximoNotas) return;

    const nota = new Nota(tamanoNotaInicial.ancho, tamanoNotaInicial.alto, 0, 0, prioridad);
    notas.push(nota);
    indiceNotaSeleccionada = -1;
    indiceNotaEnEdicion = notas.length - 1;
    notificarCambioSeleccion();
}

export function prepararTablero(lienzo, tablero = null) {
    const canvas = lienzo.nodo;
    lienzoActivo = lienzo;

    cargarNotas(tablero?.notas || []);

    if (notas.length > 0) {
        mantenerNotasDentroDelCanvas(canvas.width, canvas.height);
    }

    guardarNotas();
    configurarArrastre(lienzo);
    redibujarTablero(lienzo);
}

export function dibujarTablero(lienzo) {
    const canvas = lienzo.nodo;
    lienzoActivo = lienzo;

    agregarNota();
    posicionarNotaNueva(canvas.width, canvas.height);
    guardarNotas();
    configurarArrastre(lienzo);
    redibujarTablero(lienzo);

    return {
        contenido: notas[indiceNotaEnEdicion]?.contenido || {},
        indice: indiceNotaEnEdicion
    };
}

function redibujarTablero(lienzo) {
    const canvas = lienzo.nodo;
    const ctx = canvas.getContext("2d");

    /* Se redibuja todo para evitar residuos visuales en el canvas. */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (notas.length === 0) {
        dibujarGuiaTablero(ctx, canvas);
    }

    notas.forEach((nota, indice) => nota.dibujar(ctx, indice === indiceNotaSeleccionada));
}

function cargarNotas(notasGuardadas) {
    notas.length = 0;

    notasGuardadas.forEach((datosNota) => {
        notas.push(Nota.desdeDatos(datosNota));
    });

    normalizarPrioridadesUnicas();
}

function guardarNotas() {
    normalizarPrioridadesUnicas();
    actualizarNotasTableroActivo(notas.map((nota) => nota.aDatos()));
    notificarCambioPrioridades();
    notificarCambioNotas();
}

export function obtenerPrioridadesUsadas() {
    return [...new Set(notas
        .map((nota) => nota.prioridad)
        .filter(Boolean))];
}

export function seleccionarPrioridad(prioridad) {
    prioridadSeleccionada = prioridadSeleccionada === prioridad ? '' : prioridad;
    notificarCambioPrioridades();
}

export function obtenerPrioridadNotaSeleccionada() {
    return obtenerNotaSeleccionada()?.prioridad || '';
}

export function cambiarPrioridadNotaSeleccionada(prioridad) {
    const indice = indiceNotaSeleccionada;
    const nota = obtenerNotaSeleccionada();

    if (!nota || indice < 0) return;

    asignarPrioridadANota(indice, nota.prioridad === prioridad ? '' : prioridad);
}

export function alActualizarPrioridades(callback) {
    alCambiarPrioridades = typeof callback === 'function' ? callback : null;
}

export function alSeleccionarNota(callback) {
    alCambiarSeleccion = typeof callback === 'function' ? callback : null;
}

export function alActualizarNotas(callback) {
    alCambiarNotas = typeof callback === 'function' ? callback : null;
}

export function alSolicitarEdicionNota(callback) {
    alEditarNota = typeof callback === 'function' ? callback : null;
}

export function tableroTieneMaximoNotas() {
    return notas.length >= maximoNotas;
}

export function limpiarTablero(lienzo = lienzoActivo) {
    notas.length = 0;
    indiceNotaSeleccionada = -1;
    indiceNotaEnEdicion = -1;
    prioridadSeleccionada = '';
    guardarNotas();
    notificarCambioSeleccion();

    if (lienzo) {
        redibujarTablero(lienzo);
    }
}

export function limpiarInteraccionTablero() {
    window.removeEventListener('pointermove', moverPrioridad);
    window.removeEventListener('pointerup', soltarPrioridad);
    arrastrePrioridad?.fantasma?.remove();
    arrastrePrioridad = null;
    arrastre = null;
    prioridadSeleccionada = '';
    indiceNotaEnEdicion = -1;
}

export function obtenerRectNotaSeleccionada() {
    const nota = obtenerNotaSeleccionada();
    const canvas = lienzoActivo?.nodo;

    if (!nota || !canvas) return null;

    const rectCanvas = canvas.getBoundingClientRect();
    const rectContenedor = canvas.parentElement.getBoundingClientRect();
    const escalaX = rectCanvas.width / canvas.width;
    const escalaY = rectCanvas.height / canvas.height;

    return {
        left: rectCanvas.left - rectContenedor.left + (nota.x * escalaX),
        top: rectCanvas.top - rectContenedor.top + (nota.y * escalaY),
        width: nota.ancho * escalaX,
        height: nota.alto * escalaY
    };
}

export function guardarTextoNotaSeleccionada(contenido) {
    const nota = obtenerNotaEnEdicion();

    if (!nota || !lienzoActivo) return false;

    nota.actualizarContenido(contenido);
    indiceNotaEnEdicion = -1;
    guardarNotas();
    redibujarTablero(lienzoActivo);
    return true;
}

export function iniciarArrastrePrioridad(prioridad, evento) {
    if (!lienzoActivo) return;

    prioridadSeleccionada = prioridad;
    notificarCambioPrioridades();

    arrastrePrioridad = {
        prioridad,
        fantasma: crearFantasmaPrioridad(prioridad, evento)
    };

    window.addEventListener('pointermove', moverPrioridad);
    window.addEventListener('pointerup', soltarPrioridad, { once: true });
    evento.preventDefault();
}

function configurarArrastre(lienzo) {
    const canvas = lienzo.nodo;

    if (!canvas || canvasConEventos === canvas) return;

    canvas.addEventListener('pointerdown', iniciarArrastre);
    canvas.addEventListener('pointermove', moverNota);
    canvas.addEventListener('pointerup', terminarArrastre);
    canvas.addEventListener('pointercancel', terminarArrastre);
    canvasConEventos = canvas;
}

function obtenerNotaSeleccionada() {
    if (indiceNotaSeleccionada < 0) return null;

    return notas[indiceNotaSeleccionada] || null;
}

function obtenerNotaEnEdicion() {
    if (indiceNotaEnEdicion >= 0) {
        return notas[indiceNotaEnEdicion] || null;
    }

    return obtenerNotaSeleccionada();
}

function iniciarArrastre(evento) {
    const punto = obtenerPuntoCanvas(evento);
    const indiceEliminar = obtenerIndiceEliminarEnPunto(punto.x, punto.y);

    if (indiceEliminar !== -1) {
        eliminarNotaPorIndice(indiceEliminar);
        evento.preventDefault();
        return;
    }

    const indiceEditar = obtenerIndiceEditarEnPunto(punto.x, punto.y);

    if (indiceEditar !== -1) {
        indiceNotaSeleccionada = -1;
        indiceNotaEnEdicion = indiceEditar;
        notificarCambioSeleccion();
        redibujarTablero(lienzoActivo);
        if (typeof alEditarNota === 'function') {
            alEditarNota({ ...notas[indiceEditar].contenido });
        }
        evento.preventDefault();
        return;
    }

    const indiceNota = obtenerIndiceNotaEnPunto(punto.x, punto.y);

    if (indiceNota === -1) {
        indiceNotaSeleccionada = -1;
        indiceNotaEnEdicion = -1;
        prioridadSeleccionada = '';
        notificarCambioSeleccion();
        notificarCambioPrioridades();
        redibujarTablero(lienzoActivo);
        return;
    }

    if (prioridadSeleccionada) {
        asignarPrioridadANota(indiceNota, prioridadSeleccionada);
        prioridadSeleccionada = '';
        notificarCambioPrioridades();
        evento.preventDefault();
        return;
    }

    const nota = notas[indiceNota];

    indiceNotaEnEdicion = -1;
    arrastre = {
        indiceNota,
        offsetX: punto.x - nota.x,
        offsetY: punto.y - nota.y
    };

    /* La nota arrastrada pasa al frente para que se sienta seleccionada. */
    notas.splice(indiceNota, 1);
    notas.push(nota);
    arrastre.indiceNota = notas.length - 1;
    indiceNotaSeleccionada = arrastre.indiceNota;
    notificarCambioSeleccion();

    evento.currentTarget.setPointerCapture(evento.pointerId);
    evento.preventDefault();
    redibujarTablero(lienzoActivo);
}

function moverNota(evento) {
    if (!arrastre || !lienzoActivo) return;

    const canvas = lienzoActivo.nodo;
    const punto = obtenerPuntoCanvas(evento);
    const nota = notas[arrastre.indiceNota];

    nota.x = limitar(punto.x - arrastre.offsetX, 0, canvas.width - nota.ancho);
    nota.y = limitar(punto.y - arrastre.offsetY, 0, canvas.height - nota.alto);

    evento.preventDefault();
    redibujarTablero(lienzoActivo);
    notificarCambioSeleccion();
}

function terminarArrastre(evento) {
    if (!arrastre) return;

    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
        evento.currentTarget.releasePointerCapture(evento.pointerId);
    }

    arrastre = null;
    guardarNotas();
}

function moverPrioridad(evento) {
    if (!arrastrePrioridad?.fantasma) return;

    arrastrePrioridad.fantasma.style.left = `${evento.clientX}px`;
    arrastrePrioridad.fantasma.style.top = `${evento.clientY}px`;
}

function soltarPrioridad(evento) {
    window.removeEventListener('pointermove', moverPrioridad);

    if (!arrastrePrioridad || !lienzoActivo) return;

    const punto = obtenerPuntoCanvasDesdeCliente(evento.clientX, evento.clientY);

    let asignada = false;

    if (punto) {
        const indiceNota = obtenerIndiceNotaEnPunto(punto.x, punto.y);

        if (indiceNota !== -1) {
            asignarPrioridadANota(indiceNota, arrastrePrioridad.prioridad);
            prioridadSeleccionada = '';
            asignada = true;
        }
    }

    arrastrePrioridad.fantasma?.remove();
    arrastrePrioridad = null;

    if (asignada) {
        notificarCambioPrioridades();
    }
}

function obtenerPuntoCanvas(evento) {
    const canvas = evento.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;

    return {
        x: (evento.clientX - rect.left) * escalaX,
        y: (evento.clientY - rect.top) * escalaY
    };
}

function obtenerPuntoCanvasDesdeCliente(clientX, clientY) {
    const canvas = lienzoActivo?.nodo;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const estaDentro = clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

    if (!estaDentro) return null;

    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * escalaX,
        y: (clientY - rect.top) * escalaY
    };
}

function obtenerIndiceNotaEnPunto(x, y) {
    for (let indice = notas.length - 1; indice >= 0; indice--) {
        const nota = notas[indice];

        if (
            x >= nota.x &&
            x <= nota.x + nota.ancho &&
            y >= nota.y &&
            y <= nota.y + nota.alto
        ) {
            return indice;
        }
    }

    return -1;
}

function obtenerIndiceEliminarEnPunto(x, y) {
    for (let indice = notas.length - 1; indice >= 0; indice--) {
        if (notas[indice].contienePuntoEliminar(x, y)) {
            return indice;
        }
    }

    return -1;
}

function obtenerIndiceEditarEnPunto(x, y) {
    for (let indice = notas.length - 1; indice >= 0; indice--) {
        if (notas[indice].contienePuntoEditar(x, y)) {
            return indice;
        }
    }

    return -1;
}

function asignarPrioridadANota(indiceNota, prioridad) {
    const nota = notas[indiceNota];

    if (!nota) return;

    /* Si la prioridad ya estaba en otra nota, se mueve a la nueva.
       Asi nunca existen dos notas con la misma prioridad. */
    notas.forEach((otraNota) => {
        if (prioridad && otraNota !== nota && otraNota.prioridad === prioridad) {
            otraNota.prioridad = '';
        }
    });

    nota.prioridad = prioridad;
    normalizarPrioridadesUnicas(nota);
    indiceNotaSeleccionada = indiceNota;
    indiceNotaEnEdicion = -1;
    notificarCambioSeleccion();
    guardarNotas();
    redibujarTablero(lienzoActivo);
}

function dibujarGuiaTablero(ctx, canvas) {
    const ancho = Math.min(canvas.width - 46, 430);
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(22, 78, 63, 0.46)';
    ctx.font = '700 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    envolverTexto(ctx, 'Este espacio es para ordenar lo que tienes en mente. Agrega notas y mueve tus prioridades.', x, y, ancho, 20, 3);
    ctx.restore();
}

function envolverTexto(ctx, texto, x, y, anchoMaximo, altoLinea, maximoLineas) {
    const palabras = texto.split(' ');
    const lineas = [];
    let lineaActual = '';

    palabras.forEach((palabra) => {
        const intento = lineaActual ? `${lineaActual} ${palabra}` : palabra;

        if (ctx.measureText(intento).width <= anchoMaximo || !lineaActual) {
            lineaActual = intento;
            return;
        }

        lineas.push(lineaActual);
        lineaActual = palabra;
    });

    if (lineaActual) {
        lineas.push(lineaActual);
    }

    const visibles = lineas.slice(0, maximoLineas);
    const yInicial = y - ((visibles.length - 1) * altoLinea / 2);

    visibles.forEach((linea, indice) => {
        ctx.fillText(linea, x, yInicial + (indice * altoLinea));
    });
}

export function cambiarTamanoNotaSeleccionada(cambio) {
    if (!lienzoActivo || notas.length === 0) return;

    const canvas = lienzoActivo.nodo;
    const indice = indiceNotaSeleccionada >= 0
        ? indiceNotaSeleccionada
        : notas.length - 1;
    const nota = notas[indice];

    if (!nota) return;

    const centroX = nota.x + (nota.ancho / 2);
    const centroY = nota.y + (nota.alto / 2);
    const anchoNuevo = limitar(
        nota.ancho + cambio,
        limitesTamanoNota.anchoMinimo,
        Math.min(limitesTamanoNota.anchoMaximo, canvas.width)
    );
    const altoNuevo = limitar(
        nota.alto + (cambio * 0.82),
        limitesTamanoNota.altoMinimo,
        Math.min(limitesTamanoNota.altoMaximo, canvas.height)
    );

    nota.ancho = anchoNuevo;
    nota.alto = altoNuevo;
    nota.x = limitar(centroX - (nota.ancho / 2), 0, canvas.width - nota.ancho);
    nota.y = limitar(centroY - (nota.alto / 2), 0, canvas.height - nota.alto);

    guardarNotas();
    redibujarTablero(lienzoActivo);
    notificarCambioSeleccion();
}

function eliminarNotaSeleccionada() {
    if (indiceNotaSeleccionada < 0 || !notas[indiceNotaSeleccionada]) return;

    eliminarNotaPorIndice(indiceNotaSeleccionada);
}

function eliminarNotaPorIndice(indice) {
    if (indice < 0 || !notas[indice]) return;

    notas.splice(indice, 1);
    indiceNotaSeleccionada = notas.length ? Math.min(indiceNotaSeleccionada, notas.length - 1) : -1;
    indiceNotaEnEdicion = -1;
    guardarNotas();
    notificarCambioSeleccion();

    if (lienzoActivo) {
        redibujarTablero(lienzoActivo);
    }
}

function crearFantasmaPrioridad(prioridad, evento) {
    const fantasma = document.createElement('div');
    fantasma.className = `fantasma-sticker fantasma-sticker--${prioridad}`;
    fantasma.appendChild(crearIconoPrioridad(prioridad));
    fantasma.style.left = `${evento.clientX}px`;
    fantasma.style.top = `${evento.clientY}px`;
    document.body.appendChild(fantasma);
    return fantasma;
}

function crearIconoPrioridad(prioridad) {
    const iconos = {
        alta: 'fa-solid fa-fire',
        media: 'fa-solid fa-star-half-stroke',
        baja: 'fa-solid fa-leaf'
    };

    const icono = document.createElement('i');
    icono.className = iconos[prioridad] || 'fa-solid fa-tag';
    return icono;
}

function notificarCambioPrioridades() {
    if (typeof alCambiarPrioridades === 'function') {
        alCambiarPrioridades(obtenerPrioridadesUsadas(), prioridadSeleccionada);
    }
}

function notificarCambioSeleccion() {
    if (typeof alCambiarSeleccion === 'function') {
        alCambiarSeleccion(indiceNotaSeleccionada >= 0);
    }
}

function notificarCambioNotas() {
    if (typeof alCambiarNotas === 'function') {
        alCambiarNotas({
            cantidad: notas.length,
            maximo: maximoNotas,
            completo: tableroTieneMaximoNotas()
        });
    }
}

function normalizarPrioridadesUnicas(notaPreferida = null) {
    const prioridadesVistas = new Set();

    if (notaPreferida?.prioridad) {
        prioridadesVistas.add(notaPreferida.prioridad);
    }

    notas.forEach((nota) => {
        if (!nota.prioridad || nota === notaPreferida) return;

        if (prioridadesVistas.has(nota.prioridad)) {
            nota.prioridad = '';
            return;
        }

        prioridadesVistas.add(nota.prioridad);
    });
}

function distribuirNotas(anchoCanvas, altoCanvas) {
    const margen = 32;
    const separacion = 28;
    const cantidad = notas.length;

    ajustarTamanoNotas(anchoCanvas, altoCanvas, margen, separacion);

    const notaAncho = notas[0]?.ancho || 0;
    const notaAlto = notas[0]?.alto || 0;
    const anchoFilaTres = (notaAncho * 3) + (separacion * 2) + (margen * 2);
    const anchoFilaDos = (notaAncho * 2) + separacion + (margen * 2);
    const altoDosFilas = (notaAlto * 2) + separacion + (margen * 2);

    if (cantidad <= 1) {
        posicionarEnCentros([[0.5, 0.5]], anchoCanvas, altoCanvas, margen);
        return;
    }

    if (cantidad === 2) {
        const centros = anchoCanvas >= anchoFilaDos
            ? [[0.33, 0.5], [0.67, 0.5]]
            : [[0.5, 0.34], [0.5, 0.66]];

        posicionarEnCentros(centros, anchoCanvas, altoCanvas, margen);
        return;
    }

    if (anchoCanvas >= anchoFilaTres) {
        posicionarEnCentros([[0.22, 0.5], [0.5, 0.48], [0.78, 0.52]], anchoCanvas, altoCanvas, margen);
        return;
    }

    if (anchoCanvas >= anchoFilaDos && altoCanvas >= altoDosFilas) {
        posicionarEnCentros([[0.32, 0.35], [0.68, 0.35], [0.5, 0.68]], anchoCanvas, altoCanvas, margen);
        return;
    }

    posicionarEnCentros([[0.5, 0.24], [0.5, 0.5], [0.5, 0.76]], anchoCanvas, altoCanvas, margen);
}

function posicionarNotaNueva(anchoCanvas, altoCanvas) {
    const notaNueva = notas[notas.length - 1];

    if (!notaNueva) return;

    const margen = 32;
    const posicionesSugeridas = [
        [0.28, 0.35],
        [0.72, 0.35],
        [0.5, 0.68]
    ];

    const posicionLibre = posicionesSugeridas.find(([porcentajeX, porcentajeY]) =>
        posicionNoSeSobrepone(
            notaNueva,
            (anchoCanvas * porcentajeX) - (notaNueva.ancho / 2),
            (altoCanvas * porcentajeY) - (notaNueva.alto / 2)
        )
    ) || posicionesSugeridas[notas.length - 1] || [0.5, 0.5];

    const [porcentajeX, porcentajeY] = posicionLibre;

    notaNueva.x = limitar((anchoCanvas * porcentajeX) - (notaNueva.ancho / 2), margen, anchoCanvas - notaNueva.ancho - margen);
    notaNueva.y = limitar((altoCanvas * porcentajeY) - (notaNueva.alto / 2), margen, altoCanvas - notaNueva.alto - margen);
}

function posicionNoSeSobrepone(notaActual, x, y) {
    const separacion = 18;

    return notas.every((nota) => {
        if (nota === notaActual) return true;

        return x + notaActual.ancho + separacion < nota.x ||
            x > nota.x + nota.ancho + separacion ||
            y + notaActual.alto + separacion < nota.y ||
            y > nota.y + nota.alto + separacion;
    });
}

function ajustarTamanoNotas(anchoCanvas, altoCanvas, margen, separacion) {
    const anchoMaximoTres = (anchoCanvas - (margen * 2) - (separacion * 2)) / 3;
    const altoMaximoTres = (altoCanvas - (margen * 2) - (separacion * 2)) / 3;
    const anchoFinal = limitar(Math.min(180, Math.max(120, anchoMaximoTres)), 120, 180);
    const altoFinal = limitar(Math.min(155, Math.max(105, altoMaximoTres * 1.35)), 105, 155);

    notas.forEach((nota) => {
        nota.ancho = anchoFinal;
        nota.alto = altoFinal;
    });
}

function posicionarEnCentros(centros, anchoCanvas, altoCanvas, margen) {
    notas.forEach((nota, indice) => {
        const [porcentajeX, porcentajeY] = centros[indice];

        nota.x = limitar((anchoCanvas * porcentajeX) - (nota.ancho / 2), margen, anchoCanvas - nota.ancho - margen);
        nota.y = limitar((altoCanvas * porcentajeY) - (nota.alto / 2), margen, altoCanvas - nota.alto - margen);
    });
}

function mantenerNotasDentroDelCanvas(anchoCanvas, altoCanvas) {
    notas.forEach((nota) => {
        nota.x = limitar(nota.x, 0, anchoCanvas - nota.ancho);
        nota.y = limitar(nota.y, 0, altoCanvas - nota.alto);
    });
}

function limitar(valor, minimo, maximo) {
    if (maximo < minimo) return minimo;
    return Math.min(Math.max(valor, minimo), maximo);
}
