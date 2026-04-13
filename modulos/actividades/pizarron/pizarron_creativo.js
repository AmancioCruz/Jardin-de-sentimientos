import { contenedores } from "../../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../../utilidades/constructor_elementos.js";

const herramientas = ['pincel', 'linea', 'circulo', 'cuadrado', 'triangulo', 'mover'];

export function inicializarPizarronCreativo({ alSalir } = {}) {
    const estado = crearEstadoPizarron();
    const vista = crearVistaPizarron({
        alSalir: finalizar,
        alLimpiar: () => {
            estado.elementos = [];
            dibujarPizarron(estado);
        }
    });

    vista.montar(contenedores.contenido, true);

    estado.canvas = vista.nodo.querySelector('#pizarron-creativo-canvas');
    estado.ctx = estado.canvas.getContext('2d');
    estado.inputImagen = vista.nodo.querySelector('#pizarron-imagen');
    estado.menu = vista.nodo.querySelector('[data-menu-pizarron]');
    estado.botonMenu = vista.nodo.querySelector('[data-toggle-menu-pizarron]');

    conectarControles(vista.nodo, estado);
    conectarEventosCanvas(estado);
    ajustarCanvas(estado);
    dibujarPizarron(estado);

    window.addEventListener('resize', () => ajustarCanvas(estado));

    function finalizar() {
        if (typeof alSalir === 'function') alSalir(estado.canvas);
    }
}

function crearVistaPizarron({ alSalir, alLimpiar }) {
    return construirElemento({
        tipo: 'section',
        atributos: { class: 'actividad-pizarron' },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'pizarron-menu-flotante', 'data-menu-pizarron': '' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'button',
                            class: 'btn-pizarron-toggle',
                            'data-toggle-menu-pizarron': '',
                            'aria-expanded': 'false'
                        },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-paintbrush', 'data-icono-herramienta': '' } },
                            { tipo: 'span', atributos: { 'data-texto-herramienta': '' }, hijos: ['Pincel'] }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'pizarron-barra oculto', 'data-panel-menu-pizarron': '' },
                        hijos: [
                            {
                                tipo: 'div',
                                atributos: { class: 'grupo-pizarron grupo-pizarron--herramientas' },
                                hijos: [
                                    crearBotonHerramienta('mover', 'fa-solid fa-arrow-pointer', 'Mover'),
                                    crearBotonHerramienta('pincel', 'fa-solid fa-paintbrush', 'Pincel', true),
                                    crearBotonHerramienta('linea', 'fa-solid fa-minus', 'Línea'),
                                    crearBotonHerramienta('circulo', 'fa-regular fa-circle', 'Círculo'),
                                    crearBotonHerramienta('cuadrado', 'fa-regular fa-square', 'Cuadro'),
                                    crearBotonHerramienta('triangulo', 'fa-solid fa-caret-up', 'Triángulo')
                                ]
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'grupo-pizarron grupo-pizarron--estilo' },
                                hijos: [
                                    {
                                        tipo: 'label',
                                        atributos: { class: 'control-pizarron' },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Línea'] },
                                            { tipo: 'input', atributos: { type: 'color', value: '#164e3f', 'data-color-linea': '' } }
                                        ]
                                    },
                                    {
                                        tipo: 'label',
                                        atributos: { class: 'control-pizarron' },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Relleno'] },
                                            { tipo: 'input', atributos: { type: 'color', value: '#ffd25a', 'data-color-relleno': '' } }
                                        ]
                                    },
                                    {
                                        tipo: 'label',
                                        atributos: { class: 'control-pizarron control-pizarron--rango' },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Grosor'] },
                                            { tipo: 'input', atributos: { type: 'range', min: '2', max: '24', value: '6', 'data-grosor': '' } }
                                        ]
                                    },
                                    {
                                        tipo: 'label',
                                        atributos: { class: 'control-pizarron' },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Fondo'] },
                                            { tipo: 'input', atributos: { type: 'color', value: '#fffef9', 'data-color-fondo': '' } }
                                        ]
                                    }
                                ]
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'grupo-pizarron grupo-pizarron--acciones' },
                                hijos: [
                                    {
                                        tipo: 'button',
                                        atributos: { type: 'button', class: 'btn-pizarron-mini', 'data-subir-imagen': '' },
                                        hijos: [
                                            { tipo: 'i', atributos: { class: 'fa-solid fa-image' } },
                                            'Imagen'
                                        ]
                                    },
                                    {
                                        tipo: 'input',
                                        atributos: { type: 'file', id: 'pizarron-imagen', accept: 'image/*', class: 'oculto' }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                tipo: 'canvas',
                atributos: { id: 'pizarron-creativo-canvas', class: 'canvas-pizarron-creativo' }
            },
            {
                tipo: 'div',
                atributos: { class: 'pizarron-acciones' },
                hijos: [
                    {
                        tipo: 'button',
                        atributos: { type: 'button', class: 'btn-pizarron-mini' },
                        eventos: { click: alLimpiar },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-trash' } },
                            'Limpiar'
                        ]
                    },
                    {
                        tipo: 'button',
                        atributos: { type: 'button', class: 'btn-actividad-salir' },
                        eventos: { click: alSalir },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-check' } },
                            'Terminar'
                        ]
                    }
                ]
            }
        ]
    });
}

function crearBotonHerramienta(herramienta, icono, texto, activo = false) {
    return {
        tipo: 'button',
        atributos: {
            type: 'button',
            class: `btn-pizarron-herramienta${activo ? ' activo' : ''}`,
            'data-herramienta': herramienta,
            title: texto
        },
        hijos: [
            { tipo: 'i', atributos: { class: icono } },
            { tipo: 'span', hijos: [texto] }
        ]
    };
}

function crearEstadoPizarron() {
    return {
        canvas: null,
        ctx: null,
        inputImagen: null,
        herramienta: 'pincel',
        colorLinea: '#164e3f',
        colorRelleno: '#ffd25a',
        colorFondo: '#fffef9',
        grosor: 6,
        elementos: [],
        elementoActivo: null,
        vistaPrevia: null,
        arrastrandoImagen: null,
        mostrarGuia: true
    };
}

function conectarControles(nodo, estado) {
    const panelMenu = nodo.querySelector('[data-panel-menu-pizarron]');

    estado.botonMenu.addEventListener('click', (evento) => {
        evento.stopPropagation();
        alternarMenuPizarron(panelMenu, estado.botonMenu);
    });

    panelMenu.addEventListener('click', (evento) => evento.stopPropagation());
    document.addEventListener('pointerdown', (evento) => {
        if (!estado.menu?.contains(evento.target)) {
            cerrarMenuPizarron(panelMenu, estado.botonMenu);
        }
    });

    nodo.querySelectorAll('[data-herramienta]').forEach((boton) => {
        boton.addEventListener('click', () => {
            estado.herramienta = boton.dataset.herramienta;
            nodo.querySelectorAll('[data-herramienta]').forEach((item) => item.classList.remove('activo'));
            boton.classList.add('activo');
            actualizarBotonMenu(estado, boton);
            cerrarMenuPizarron(panelMenu, estado.botonMenu);
        });
    });

    nodo.querySelector('[data-color-linea]').addEventListener('input', (evento) => {
        estado.colorLinea = evento.target.value;
    });

    nodo.querySelector('[data-color-relleno]').addEventListener('input', (evento) => {
        estado.colorRelleno = evento.target.value;
    });

    nodo.querySelector('[data-grosor]').addEventListener('input', (evento) => {
        estado.grosor = Number(evento.target.value);
    });

    nodo.querySelector('[data-color-fondo]').addEventListener('input', (evento) => {
        estado.colorFondo = evento.target.value;
        dibujarPizarron(estado);
    });

    nodo.querySelector('[data-subir-imagen]').addEventListener('click', () => {
        estado.inputImagen.click();
    });

    estado.inputImagen.addEventListener('change', (evento) => cargarImagenComoSticker(evento, estado));
    actualizarBotonMenu(estado, nodo.querySelector('[data-herramienta].activo'));
}

function alternarMenuPizarron(panelMenu, botonMenu) {
    const abierto = !panelMenu.classList.contains('oculto');
    panelMenu.classList.toggle('oculto', abierto);
    botonMenu.setAttribute('aria-expanded', String(!abierto));
}

function cerrarMenuPizarron(panelMenu, botonMenu) {
    panelMenu.classList.add('oculto');
    botonMenu.setAttribute('aria-expanded', 'false');
}

function actualizarBotonMenu(estado, botonHerramienta) {
    const icono = estado.botonMenu.querySelector('[data-icono-herramienta]');
    const texto = estado.botonMenu.querySelector('[data-texto-herramienta]');
    const iconoSeleccionado = botonHerramienta?.querySelector('i')?.getAttribute('class') || 'fa-solid fa-paintbrush';
    const textoSeleccionado = botonHerramienta?.querySelector('span')?.textContent || 'Pincel';

    icono.setAttribute('class', iconoSeleccionado);
    texto.textContent = textoSeleccionado;
}

function conectarEventosCanvas(estado) {
    estado.canvas.addEventListener('pointerdown', (evento) => iniciarTrazo(evento, estado));
    estado.canvas.addEventListener('pointermove', (evento) => moverTrazo(evento, estado));
    estado.canvas.addEventListener('pointerup', () => terminarTrazo(estado));
    estado.canvas.addEventListener('pointercancel', () => terminarTrazo(estado));
}

function iniciarTrazo(evento, estado) {
    const punto = obtenerPuntoCanvas(evento, estado.canvas);
    evento.preventDefault();

    if (estado.herramienta === 'mover') {
        estado.arrastrandoImagen = buscarElementoEnPunto(estado, punto);
        if (estado.arrastrandoImagen) {
            estado.arrastrandoImagen.ultimoPunto = punto;
            estado.mostrarGuia = false;
        }
        return;
    }

    if (estado.herramienta === 'pincel') {
        estado.mostrarGuia = false;
        estado.elementoActivo = crearElementoBase('pincel', estado, punto);
        estado.elementoActivo.puntos = [punto];
        estado.elementos.push(estado.elementoActivo);
        return;
    }

    if (herramientas.includes(estado.herramienta)) {
        estado.mostrarGuia = false;
        estado.vistaPrevia = crearElementoBase(estado.herramienta, estado, punto);
    }
}

function moverTrazo(evento, estado) {
    const punto = obtenerPuntoCanvas(evento, estado.canvas);
    evento.preventDefault();

    if (estado.arrastrandoImagen) {
        const dx = punto.x - estado.arrastrandoImagen.ultimoPunto.x;
        const dy = punto.y - estado.arrastrandoImagen.ultimoPunto.y;
        moverElemento(estado.arrastrandoImagen.elemento, dx, dy);
        estado.arrastrandoImagen.ultimoPunto = punto;
        dibujarPizarron(estado);
        return;
    }

    if (estado.elementoActivo?.tipo === 'pincel') {
        estado.elementoActivo.puntos.push(punto);
        dibujarPizarron(estado);
        return;
    }

    if (estado.vistaPrevia) {
        estado.vistaPrevia.fin = punto;
        dibujarPizarron(estado);
    }
}

function terminarTrazo(estado) {
    if (estado.vistaPrevia) {
        estado.elementos.push(estado.vistaPrevia);
    }

    estado.elementoActivo = null;
    estado.vistaPrevia = null;
    estado.arrastrandoImagen = null;
    dibujarPizarron(estado);
}

function crearElementoBase(tipo, estado, inicio) {
    return {
        tipo,
        inicio,
        fin: inicio,
        colorLinea: estado.colorLinea,
        colorRelleno: estado.colorRelleno,
        grosor: estado.grosor
    };
}

function cargarImagenComoSticker(evento, estado) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
        const imagen = new Image();
        imagen.onload = () => {
            const ancho = Math.min(150, estado.canvas.width * 0.32);
            const alto = ancho * (imagen.height / imagen.width);

            estado.elementos.push({
                tipo: 'imagen',
                imagen,
                x: (estado.canvas.width - ancho) / 2,
                y: (estado.canvas.height - alto) / 2,
                ancho,
                alto
            });
            estado.herramienta = 'mover';
            estado.mostrarGuia = false;
            document.querySelectorAll('[data-herramienta]').forEach((item) => {
                item.classList.toggle('activo', item.dataset.herramienta === 'mover');
            });
            actualizarBotonMenu(estado, document.querySelector('[data-herramienta="mover"]'));
            dibujarPizarron(estado);
        };
        imagen.src = lector.result;
    };
    lector.readAsDataURL(archivo);
    evento.target.value = '';
}

function dibujarPizarron(estado) {
    const { ctx, canvas } = estado;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = estado.colorFondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (estado.mostrarGuia && estado.elementos.length === 0 && !estado.vistaPrevia) {
        dibujarGuiaPizarron(ctx, canvas);
    }

    estado.elementos.forEach((elemento) => dibujarElemento(ctx, elemento));

    if (estado.vistaPrevia) {
        dibujarElemento(ctx, estado.vistaPrevia);
    }
}

function dibujarGuiaPizarron(ctx, canvas) {
    const ancho = Math.min(canvas.width - 46, 420);
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(22, 78, 63, 0.46)';
    ctx.font = '700 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    envolverTexto(ctx, 'No necesitas saber dibujar. Usa líneas, colores o imágenes para expresar lo que sientes.', x, y - 16, ancho - 42, 20, 3);
    ctx.restore();
}

function dibujarElemento(ctx, elemento) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = elemento.grosor || 4;
    ctx.strokeStyle = elemento.colorLinea || '#164e3f';
    ctx.fillStyle = elemento.colorRelleno || 'transparent';

    if (elemento.tipo === 'pincel') dibujarPincel(ctx, elemento);
    if (elemento.tipo === 'linea') dibujarLinea(ctx, elemento);
    if (elemento.tipo === 'circulo') dibujarCirculo(ctx, elemento);
    if (elemento.tipo === 'cuadrado') dibujarCuadrado(ctx, elemento);
    if (elemento.tipo === 'triangulo') dibujarTriangulo(ctx, elemento);
    if (elemento.tipo === 'imagen') ctx.drawImage(elemento.imagen, elemento.x, elemento.y, elemento.ancho, elemento.alto);

    ctx.restore();
}

function dibujarPincel(ctx, elemento) {
    ctx.beginPath();
    elemento.puntos.forEach((punto, indice) => {
        if (indice === 0) ctx.moveTo(punto.x, punto.y);
        else ctx.lineTo(punto.x, punto.y);
    });
    ctx.stroke();
}

function dibujarLinea(ctx, elemento) {
    ctx.beginPath();
    ctx.moveTo(elemento.inicio.x, elemento.inicio.y);
    ctx.lineTo(elemento.fin.x, elemento.fin.y);
    ctx.stroke();
}

function dibujarCirculo(ctx, elemento) {
    const radio = Math.hypot(elemento.fin.x - elemento.inicio.x, elemento.fin.y - elemento.inicio.y);
    ctx.beginPath();
    ctx.arc(elemento.inicio.x, elemento.inicio.y, radio, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function dibujarCuadrado(ctx, elemento) {
    const x = Math.min(elemento.inicio.x, elemento.fin.x);
    const y = Math.min(elemento.inicio.y, elemento.fin.y);
    const ancho = Math.abs(elemento.fin.x - elemento.inicio.x);
    const alto = Math.abs(elemento.fin.y - elemento.inicio.y);
    ctx.fillRect(x, y, ancho, alto);
    ctx.strokeRect(x, y, ancho, alto);
}

function dibujarTriangulo(ctx, elemento) {
    const xCentro = (elemento.inicio.x + elemento.fin.x) / 2;
    const ySuperior = Math.min(elemento.inicio.y, elemento.fin.y);
    const yInferior = Math.max(elemento.inicio.y, elemento.fin.y);
    const xIzquierda = Math.min(elemento.inicio.x, elemento.fin.x);
    const xDerecha = Math.max(elemento.inicio.x, elemento.fin.x);

    ctx.beginPath();
    ctx.moveTo(xCentro, ySuperior);
    ctx.lineTo(xDerecha, yInferior);
    ctx.lineTo(xIzquierda, yInferior);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function buscarElementoEnPunto(estado, punto) {
    for (let indice = estado.elementos.length - 1; indice >= 0; indice--) {
        const elemento = estado.elementos[indice];

        if (puntoDentroDeElemento(elemento, punto)) {
            return { elemento, ultimoPunto: punto };
        }
    }

    return null;
}

function puntoDentroDeElemento(elemento, punto) {
    if (elemento.tipo === 'imagen') {
        return punto.x >= elemento.x &&
            punto.x <= elemento.x + elemento.ancho &&
            punto.y >= elemento.y &&
            punto.y <= elemento.y + elemento.alto;
    }

    const caja = obtenerCajaElemento(elemento);
    const margen = Math.max(12, elemento.grosor || 4);

    return punto.x >= caja.x - margen &&
        punto.x <= caja.x + caja.ancho + margen &&
        punto.y >= caja.y - margen &&
        punto.y <= caja.y + caja.alto + margen;
}

function obtenerCajaElemento(elemento) {
    if (elemento.tipo === 'pincel') {
        const xs = elemento.puntos.map((punto) => punto.x);
        const ys = elemento.puntos.map((punto) => punto.y);
        return crearCajaDesdeExtremos(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
    }

    if (elemento.tipo === 'circulo') {
        const radio = Math.hypot(elemento.fin.x - elemento.inicio.x, elemento.fin.y - elemento.inicio.y);
        return crearCajaDesdeExtremos(
            elemento.inicio.x - radio,
            elemento.inicio.y - radio,
            elemento.inicio.x + radio,
            elemento.inicio.y + radio
        );
    }

    return crearCajaDesdeExtremos(
        Math.min(elemento.inicio.x, elemento.fin.x),
        Math.min(elemento.inicio.y, elemento.fin.y),
        Math.max(elemento.inicio.x, elemento.fin.x),
        Math.max(elemento.inicio.y, elemento.fin.y)
    );
}

function crearCajaDesdeExtremos(x1, y1, x2, y2) {
    return {
        x: x1,
        y: y1,
        ancho: x2 - x1,
        alto: y2 - y1
    };
}

function moverElemento(elemento, dx, dy) {
    if (elemento.tipo === 'imagen') {
        elemento.x += dx;
        elemento.y += dy;
        return;
    }

    if (elemento.tipo === 'pincel') {
        elemento.puntos.forEach((punto) => {
            punto.x += dx;
            punto.y += dy;
        });
        return;
    }

    elemento.inicio.x += dx;
    elemento.inicio.y += dy;
    elemento.fin.x += dx;
    elemento.fin.y += dy;
}

function ajustarCanvas(estado) {
    if (!estado.canvas) return;

    const rect = estado.canvas.getBoundingClientRect();
    estado.canvas.width = Math.max(320, Math.floor(rect.width));
    estado.canvas.height = Math.max(320, Math.floor(rect.height));
    dibujarPizarron(estado);
}

function obtenerPuntoCanvas(evento, canvas) {
    const rect = canvas.getBoundingClientRect();
    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;

    return {
        x: (evento.clientX - rect.left) * escalaX,
        y: (evento.clientY - rect.top) * escalaY
    };
}

function redondearRect(ctx, x, y, ancho, alto, radio) {
    const r = Math.min(radio, ancho / 2, alto / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + ancho, y, x + ancho, y + alto, r);
    ctx.arcTo(x + ancho, y + alto, x, y + alto, r);
    ctx.arcTo(x, y + alto, x, y, r);
    ctx.arcTo(x, y, x + ancho, y, r);
    ctx.closePath();
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
