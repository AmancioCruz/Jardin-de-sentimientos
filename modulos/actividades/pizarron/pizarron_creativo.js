import { contenedores } from "../../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../../utilidades/constructor_elementos.js";
import { mostrarTutorialActividad } from "../../../componentes/tutorial_actividad/tutorial_actividad.js";

const herramientasDibujo = ['pincel', 'linea', 'circulo', 'cuadro', 'triangulo'];
const herramientasConRelleno = new Set(['circulo', 'cuadro', 'triangulo']);

export function inicializarPizarronCreativo({ alGuardar, alSalir } = {}) {
    const estado = crearEstadoPizarron();
    const vista = crearVistaPizarron({
        alGuardar: guardar,
        alSalir: salirSinGuardar,
        alLimpiar: () => {
            estado.elementos = [];
            estado.elementoSeleccionado = null;
            estado.arrastrandoImagen = null;
            estado.colorFondo = '#fffef9';
            if (estado.inputFondo) estado.inputFondo.value = estado.colorFondo;
            dibujarPizarron(estado);
            actualizarEstadoGuardadoPizarron(estado);
            actualizarBotonEliminarSeleccion(estado);
        }
    });

    vista.montar(contenedores.contenido, true);

    estado.canvas = vista.nodo.querySelector('#pizarron-creativo-canvas');
    estado.ctx = estado.canvas.getContext('2d');
    estado.inputImagen = vista.nodo.querySelector('#pizarron-imagen');
    estado.menu = vista.nodo.querySelector('[data-menu-pizarron]');
    estado.botonMenu = vista.nodo.querySelector('[data-toggle-menu-pizarron]');
    estado.iconoMenu = vista.nodo.querySelector('[data-icono-menu-pizarron]');
    estado.textoMenu = vista.nodo.querySelector('[data-texto-menu-pizarron]');
    estado.botonGuardar = vista.nodo.querySelector('[data-guardar-pizarron]');
    estado.botonEliminarSeleccion = vista.nodo.querySelector('[data-eliminar-seleccion]');
    estado.inputFondo = vista.nodo.querySelector('[data-color-fondo]');
    estado.controles = {
        panel: vista.nodo.querySelector('[data-panel-menu-pizarron]'),
        herramientas: vista.nodo.querySelector('[data-grupo-herramientas]'),
        configuracion: vista.nodo.querySelector('[data-grupo-configuracion]')
    };

    conectarControles(vista.nodo, estado);
    conectarEventosCanvas(estado);
    ajustarCanvas(estado);
    dibujarPizarron(estado);
    actualizarEstadoGuardadoPizarron(estado);
    mostrarTutorialActividad({
        id: 'pizarron-creativo',
        titulo: 'Guía rápida del pizarrón',
        descripcion: 'Usa colores, formas o imágenes para expresar lo que sientes sin tener que explicarlo con palabras.',
        pasos: [
            { icono: 'fa-solid fa-paintbrush', texto: 'El botón principal abre herramientas como pincel, línea y figuras.' },
            { icono: 'fa-solid fa-arrow-pointer', texto: 'Seleccionar te permite mover o borrar trazos, figuras e imágenes.' },
            { icono: 'fa-solid fa-image', texto: 'Imagen agrega un recurso propio al lienzo.' },
            { icono: 'fa-solid fa-fill-drip', texto: 'Fondo cambia el color del lienzo sin interrumpir lo que haces.' },
            { icono: 'fa-solid fa-trash', texto: 'La papelera aparece sobre el elemento seleccionado para borrarlo.' },
            { icono: 'fa-solid fa-trash', texto: 'Limpiar deja el lienzo en blanco para empezar de nuevo.' },
            { icono: 'fa-solid fa-check', texto: 'Guardar conserva tu creación en la bitácora.' },
            { icono: 'fa-solid fa-xmark', texto: 'Salir cierra la actividad sin guardar.' }
        ]
    });

    const manejarResize = () => ajustarCanvas(estado);
    window.addEventListener('resize', manejarResize);
    estado.limpiadores.push(() => window.removeEventListener('resize', manejarResize));

    function guardar() {
        if (!tieneContenidoPizarron(estado)) return;

        limpiarRecursosPizarron(estado);
        if (typeof alGuardar === 'function') alGuardar(estado.canvas);
    }

    function salirSinGuardar() {
        limpiarRecursosPizarron(estado);
        if (typeof alSalir === 'function') alSalir();
    }

    return () => limpiarRecursosPizarron(estado);
}

function crearVistaPizarron({ alGuardar, alSalir, alLimpiar }) {
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
                            'aria-expanded': 'false',
                            'data-toggle-menu-pizarron': ''
                        },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-paintbrush', 'data-icono-menu-pizarron': '' } },
                            { tipo: 'span', hijos: ['Pincel'], atributos: { 'data-texto-menu-pizarron': '' } },
                            { tipo: 'i', atributos: { class: 'fa-solid fa-chevron-down btn-pizarron-toggle__chevron' } }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'pizarron-barra oculto', 'data-panel-menu-pizarron': '' },
                        hijos: [
                            {
                                tipo: 'div',
                                atributos: { class: 'grupo-pizarron grupo-pizarron--principales', 'aria-label': 'Opciones principales del pizarrón' },
                                hijos: [
                                    crearBotonModo('imagen', 'fa-solid fa-image', 'Imagen'),
                                    crearBotonModo('seleccionar', 'fa-solid fa-arrow-pointer', 'Seleccionar'),
                                    crearBotonModo('dibujar', 'fa-solid fa-paintbrush', 'Dibujar', true),
                                    crearControlFondo(),
                                    {
                                        tipo: 'input',
                                        atributos: { type: 'file', id: 'pizarron-imagen', accept: 'image/*', class: 'oculto' }
                                    }
                                ]
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'grupo-pizarron grupo-pizarron--herramientas', 'aria-label': 'Herramientas de dibujo', 'data-grupo-herramientas': '' },
                                hijos: [
                                    crearBotonHerramienta('pincel', 'fa-solid fa-paintbrush', 'Pincel', true),
                                    crearBotonHerramienta('linea', 'fa-solid fa-minus', 'Línea'),
                                    crearBotonHerramienta('circulo', 'fa-regular fa-circle', 'Círculo'),
                                    crearBotonHerramienta('cuadro', 'fa-regular fa-square', 'Cuadro'),
                                    crearBotonHerramienta('triangulo', 'fa-solid fa-caret-up', 'Triángulo')
                                ]
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'grupo-pizarron grupo-pizarron--estilo', 'aria-label': 'Configuración del dibujo', 'data-grupo-configuracion': '' },
                                hijos: [
                                    {
                                        tipo: 'label',
                                        atributos: { class: 'control-pizarron', 'data-config-linea': '' },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Contorno'] },
                                            { tipo: 'input', atributos: { type: 'color', value: '#164e3f', 'data-color-linea': '' } }
                                        ]
                                    },
                                    {
                                        tipo: 'label',
                                        atributos: { class: 'control-pizarron', 'data-config-relleno': '' },
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
                tipo: 'button',
                atributos: {
                    type: 'button',
                    class: 'btn-eliminar-seleccion-pizarron oculto',
                    title: 'Eliminar elemento seleccionado',
                    'aria-label': 'Eliminar elemento seleccionado',
                    'data-eliminar-seleccion': ''
                },
                hijos: [
                    { tipo: 'i', atributos: { class: 'fa-solid fa-trash' } }
                ]
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
                        atributos: { type: 'button', class: 'btn-pizarron-mini' },
                        eventos: { click: alSalir },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-xmark' } },
                            'Salir'
                        ]
                    },
                    {
                        tipo: 'button',
                        atributos: { type: 'button', class: 'btn-actividad-salir', 'data-guardar-pizarron': '' },
                        eventos: { click: alGuardar },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-check' } },
                            'Guardar'
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

function crearBotonModo(modo, icono, texto, activo = false) {
    return {
        tipo: 'button',
        atributos: {
            type: 'button',
            class: `btn-pizarron-herramienta${activo ? ' activo' : ''}`,
            'data-modo-pizarron': modo,
            title: texto
        },
        hijos: [
            { tipo: 'i', atributos: { class: icono } },
            { tipo: 'span', hijos: [texto] }
        ]
    };
}

function crearControlFondo() {
    return {
        tipo: 'label',
        atributos: { class: 'control-pizarron control-pizarron--fondo' },
        hijos: [
            { tipo: 'span', hijos: ['Fondo'] },
            {
                tipo: 'input',
                atributos: {
                    type: 'color',
                    value: '#fffef9',
                    title: 'Color de fondo',
                    'aria-label': 'Color de fondo del pizarrÃ³n',
                    'data-color-fondo': ''
                }
            }
        ]
    };
}

function crearEstadoPizarron() {
    return {
        canvas: null,
        ctx: null,
        inputImagen: null,
        inputFondo: null,
        botonMenu: null,
        iconoMenu: null,
        textoMenu: null,
        menuAbierto: false,
        modo: 'dibujar',
        herramienta: 'pincel',
        colorLinea: '#164e3f',
        colorRelleno: '#ffd25a',
        colorFondo: '#fffef9',
        grosor: 6,
        elementos: [],
        elementoActivo: null,
        elementoSeleccionado: null,
        vistaPrevia: null,
        arrastrandoImagen: null,
        botonGuardar: null,
        botonEliminarSeleccion: null,
        controles: {},
        mostrarGuia: true,
        limpiadores: []
    };
}

function conectarControles(nodo, estado) {
    estado.botonMenu.addEventListener('click', () => {
        estado.menuAbierto = !estado.menuAbierto;
        actualizarInterfazPizarron(estado);
    });

    nodo.querySelectorAll('[data-modo-pizarron]').forEach((boton) => {
        boton.addEventListener('click', () => cambiarModoPizarron(estado, boton.dataset.modoPizarron));
    });

    nodo.querySelectorAll('[data-herramienta]').forEach((boton) => {
        boton.addEventListener('click', () => {
            cambiarHerramientaPizarron(estado, boton.dataset.herramienta);
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
        estado.modo = 'seleccionar';
        estado.herramienta = null;
        dibujarPizarron(estado);
        actualizarEstadoGuardadoPizarron(estado);
        actualizarInterfazPizarron(estado);
    });

    nodo.querySelector('[data-modo-pizarron="imagen"]').addEventListener('click', () => {
        estado.inputImagen.click();
    });

    estado.botonEliminarSeleccion.addEventListener('click', () => {
        borrarElementoSeleccionado(estado);
    });

    estado.inputImagen.addEventListener('change', (evento) => cargarImagenComoSticker(evento, estado));
    const cerrarAlHacerClickFuera = (evento) => {
        if (estado.menu?.contains(evento.target)) return;
        estado.menuAbierto = false;
        actualizarInterfazPizarron(estado);
    };
    document.addEventListener('pointerdown', cerrarAlHacerClickFuera);
    estado.limpiadores.push(() => document.removeEventListener('pointerdown', cerrarAlHacerClickFuera));
    actualizarInterfazPizarron(estado);
}

function limpiarRecursosPizarron(estado) {
    estado.limpiadores.forEach((limpiar) => limpiar());
    estado.limpiadores = [];
}

function cambiarModoPizarron(estado, modo) {
    if (!['seleccionar', 'dibujar', 'imagen'].includes(modo)) return;

    estado.modo = modo;
    estado.herramienta = modo === 'dibujar'
        ? estado.herramienta || 'pincel'
        : null;
    estado.elementoActivo = null;
    estado.vistaPrevia = null;
    estado.arrastrandoImagen = null;

    if (modo !== 'seleccionar') {
        estado.elementoSeleccionado = null;
    }

    actualizarInterfazPizarron(estado);
    dibujarPizarron(estado);
}

function cambiarHerramientaPizarron(estado, herramienta) {
    if (!herramientasDibujo.includes(herramienta)) return;

    estado.modo = 'dibujar';
    estado.herramienta = herramienta;
    estado.elementoSeleccionado = null;
    estado.elementoActivo = null;
    estado.vistaPrevia = null;
    estado.arrastrandoImagen = null;
    actualizarInterfazPizarron(estado);
    dibujarPizarron(estado);
}

function actualizarInterfazPizarron(estado) {
    const raiz = estado.menu?.closest('.actividad-pizarron') || estado.menu;
    const resumen = obtenerResumenMenuPizarron(estado);

    raiz?.querySelectorAll('[data-modo-pizarron]').forEach((boton) => {
        const activo = boton.dataset.modoPizarron === estado.modo;
        boton.classList.toggle('activo', activo);
        boton.setAttribute('aria-pressed', String(activo));
    });

    raiz?.querySelectorAll('[data-herramienta]').forEach((boton) => {
        const activo = estado.modo === 'dibujar' && boton.dataset.herramienta === estado.herramienta;
        boton.classList.toggle('activo', activo);
        boton.setAttribute('aria-pressed', String(activo));
    });

    estado.controles.herramientas?.classList.toggle('oculto', estado.modo !== 'dibujar');
    estado.controles.configuracion?.classList.toggle('oculto', estado.modo !== 'dibujar');
    estado.controles.panel?.classList.toggle('oculto', !estado.menuAbierto);
    estado.botonMenu?.classList.toggle('activo', estado.menuAbierto);
    estado.botonMenu?.setAttribute('aria-expanded', String(estado.menuAbierto));
    estado.iconoMenu?.setAttribute('class', resumen.icono);
    estado.textoMenu?.replaceChildren(document.createTextNode(resumen.texto));

    const mostrarRelleno = estado.modo === 'dibujar' && herramientasConRelleno.has(estado.herramienta);
    estado.controles.configuracion?.querySelector('[data-config-relleno]')?.classList.toggle('oculto', !mostrarRelleno);
    estado.controles.configuracion?.querySelector('[data-config-linea] span')?.replaceChildren(
        document.createTextNode(mostrarRelleno ? 'Contorno' : 'Linea')
    );

    if (estado.canvas) {
        estado.canvas.classList.toggle('modo-seleccionar', estado.modo === 'seleccionar');
        estado.canvas.classList.toggle('modo-dibujar', estado.modo === 'dibujar');
    }

    actualizarBotonEliminarSeleccion(estado);
}

function obtenerResumenMenuPizarron(estado) {
    const datosHerramientas = {
        pincel: { texto: 'Pincel', icono: 'fa-solid fa-paintbrush' },
        linea: { texto: 'Linea', icono: 'fa-solid fa-minus' },
        circulo: { texto: 'Circulo', icono: 'fa-regular fa-circle' },
        cuadro: { texto: 'Cuadro', icono: 'fa-regular fa-square' },
        triangulo: { texto: 'Triangulo', icono: 'fa-solid fa-caret-up' }
    };

    if (estado.modo === 'seleccionar') {
        return { texto: 'Seleccionar', icono: 'fa-solid fa-arrow-pointer' };
    }

    if (estado.modo === 'imagen') {
        return { texto: 'Imagen', icono: 'fa-solid fa-image' };
    }

    return datosHerramientas[estado.herramienta] || datosHerramientas.pincel;
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

    if (estado.modo === 'seleccionar') {
        estado.arrastrandoImagen = buscarElementoEnPunto(estado, punto);
        if (estado.arrastrandoImagen) {
            estado.elementoSeleccionado = estado.arrastrandoImagen.elemento;
            estado.arrastrandoImagen.ultimoPunto = punto;
            estado.mostrarGuia = false;
        } else {
            estado.elementoSeleccionado = null;
        }
        actualizarBotonEliminarSeleccion(estado);
        dibujarPizarron(estado);
        return;
    }

    if (estado.modo !== 'dibujar') return;

    estado.elementoSeleccionado = null;
    actualizarBotonEliminarSeleccion(estado);

    if (estado.herramienta === 'pincel') {
        estado.mostrarGuia = false;
        estado.elementoActivo = crearElementoBase('pincel', estado, punto);
        estado.elementoActivo.puntos = [punto];
        estado.elementos.push(estado.elementoActivo);
        actualizarEstadoGuardadoPizarron(estado);
        return;
    }

    if (herramientasDibujo.includes(estado.herramienta)) {
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
        actualizarBotonEliminarSeleccion(estado);
        dibujarPizarron(estado);
        return;
    }

    if (estado.modo !== 'dibujar') return;

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
        actualizarEstadoGuardadoPizarron(estado);
    }

    estado.elementoActivo = null;
    estado.vistaPrevia = null;
    estado.arrastrandoImagen = null;
    dibujarPizarron(estado);
    actualizarBotonEliminarSeleccion(estado);
}

function tieneContenidoPizarron(estado) {
    return estado.elementos.length > 0 || estado.colorFondo.toLowerCase() !== '#fffef9';
}

function actualizarEstadoGuardadoPizarron(estado) {
    if (!estado.botonGuardar) return;

    const hayContenido = tieneContenidoPizarron(estado);
    estado.botonGuardar.disabled = !hayContenido;
    estado.botonGuardar.title = hayContenido
        ? 'Guardar pizarrón'
        : 'Agrega un trazo, figura, imagen o cambia el fondo para guardar';
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
            estado.modo = 'seleccionar';
            estado.herramienta = null;
            estado.elementoSeleccionado = estado.elementos[estado.elementos.length - 1];
            estado.mostrarGuia = false;
            actualizarInterfazPizarron(estado);
            dibujarPizarron(estado);
            actualizarEstadoGuardadoPizarron(estado);
            actualizarBotonEliminarSeleccion(estado);
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

    estado.elementos.forEach((elemento) => {
        dibujarElemento(ctx, elemento);
        if (elemento === estado.elementoSeleccionado) {
            dibujarSeleccionElemento(ctx, elemento);
        }
    });

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
    envolverTexto(ctx, 'Usa líneas, colores o imágenes para expresar lo que sientes.', x, y - 16, ancho - 42, 20, 3);
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
    if (elemento.tipo === 'cuadro' || elemento.tipo === 'cuadrado') dibujarCuadrado(ctx, elemento);
    if (elemento.tipo === 'triangulo') dibujarTriangulo(ctx, elemento);
    if (elemento.tipo === 'imagen') ctx.drawImage(elemento.imagen, elemento.x, elemento.y, elemento.ancho, elemento.alto);

    ctx.restore();
}

function dibujarSeleccionElemento(ctx, elemento) {
    const caja = obtenerCajaElemento(elemento);

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(22, 78, 63, 0.62)';
    ctx.strokeRect(caja.x - 8, caja.y - 8, caja.ancho + 16, caja.alto + 16);
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
    let candidato = null;

    for (let indice = estado.elementos.length - 1; indice >= 0; indice--) {
        const elemento = estado.elementos[indice];
        const distancia = distanciaAElemento(elemento, punto);

        if (distancia === null) {
            continue;
        }

        if (!candidato || distancia < candidato.distancia || distancia === candidato.distancia && indice > candidato.indice) {
            candidato = { elemento, ultimoPunto: punto, distancia, indice };
        }
    }

    return candidato;
}

function distanciaAElemento(elemento, punto) {
    const margen = Math.max(10, (elemento.grosor || 4) + 6);

    if (elemento.tipo === 'imagen') {
        return punto.x >= elemento.x &&
            punto.x <= elemento.x + elemento.ancho &&
            punto.y >= elemento.y &&
            punto.y <= elemento.y + elemento.alto
            ? 0
            : null;
    }

    if (elemento.tipo === 'pincel') {
        const distancia = distanciaAPolilinea(elemento.puntos, punto);
        return distancia <= margen ? distancia : null;
    }

    if (elemento.tipo === 'linea') {
        const distancia = distanciaPuntoASegmento(punto, elemento.inicio, elemento.fin);
        return distancia <= margen ? distancia : null;
    }

    if (elemento.tipo === 'circulo') {
        const radio = Math.hypot(elemento.fin.x - elemento.inicio.x, elemento.fin.y - elemento.inicio.y);
        const distanciaCentro = Math.hypot(punto.x - elemento.inicio.x, punto.y - elemento.inicio.y);

        if (elemento.colorRelleno && elemento.colorRelleno !== 'transparent' && distanciaCentro <= radio + margen) {
            return 0;
        }

        const distanciaBorde = Math.abs(distanciaCentro - radio);
        return distanciaBorde <= margen ? distanciaBorde : null;
    }

    if (elemento.tipo === 'cuadro' || elemento.tipo === 'cuadrado') {
        const caja = obtenerCajaElemento(elemento);
        return punto.x >= caja.x - margen &&
            punto.x <= caja.x + caja.ancho + margen &&
            punto.y >= caja.y - margen &&
            punto.y <= caja.y + caja.alto + margen
            ? 0
            : null;
    }

    if (elemento.tipo === 'triangulo') {
        const vertices = obtenerVerticesTriangulo(elemento);
        return puntoDentroDeTriangulo(punto, vertices) || puntoCercaDeSegmentos(punto, vertices, margen)
            ? 0
            : null;
    }

    return null;
}

function obtenerCajaElemento(elemento) {
    if (elemento.tipo === 'imagen') {
        return {
            x: elemento.x,
            y: elemento.y,
            ancho: elemento.ancho,
            alto: elemento.alto
        };
    }

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

function obtenerVerticesTriangulo(elemento) {
    const xCentro = (elemento.inicio.x + elemento.fin.x) / 2;
    const ySuperior = Math.min(elemento.inicio.y, elemento.fin.y);
    const yInferior = Math.max(elemento.inicio.y, elemento.fin.y);
    const xIzquierda = Math.min(elemento.inicio.x, elemento.fin.x);
    const xDerecha = Math.max(elemento.inicio.x, elemento.fin.x);

    return [
        { x: xCentro, y: ySuperior },
        { x: xDerecha, y: yInferior },
        { x: xIzquierda, y: yInferior }
    ];
}

function distanciaAPolilinea(puntos, punto) {
    if (!puntos?.length) return Infinity;
    if (puntos.length === 1) return Math.hypot(punto.x - puntos[0].x, punto.y - puntos[0].y);

    let distanciaMenor = Infinity;

    for (let indice = 1; indice < puntos.length; indice++) {
        distanciaMenor = Math.min(
            distanciaMenor,
            distanciaPuntoASegmento(punto, puntos[indice - 1], puntos[indice])
        );
    }

    return distanciaMenor;
}

function distanciaPuntoASegmento(punto, inicio, fin) {
    const dx = fin.x - inicio.x;
    const dy = fin.y - inicio.y;
    const longitudCuadrada = dx * dx + dy * dy;

    if (longitudCuadrada === 0) {
        return Math.hypot(punto.x - inicio.x, punto.y - inicio.y);
    }

    const proporcion = Math.max(0, Math.min(1, ((punto.x - inicio.x) * dx + (punto.y - inicio.y) * dy) / longitudCuadrada));
    const x = inicio.x + proporcion * dx;
    const y = inicio.y + proporcion * dy;

    return Math.hypot(punto.x - x, punto.y - y);
}

function puntoDentroDeTriangulo(punto, vertices) {
    const [a, b, c] = vertices;
    const area = (p1, p2, p3) => Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);
    const total = area(a, b, c);
    const suma = area(punto, b, c) + area(a, punto, c) + area(a, b, punto);

    return Math.abs(total - suma) < 0.5;
}

function puntoCercaDeSegmentos(punto, vertices, margen) {
    return vertices.some((vertice, indice) => {
        const siguiente = vertices[(indice + 1) % vertices.length];
        return distanciaPuntoASegmento(punto, vertice, siguiente) <= margen;
    });
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

function borrarElementoSeleccionado(estado) {
    if (!estado.elementoSeleccionado) return;

    estado.elementos = estado.elementos.filter((elemento) => elemento !== estado.elementoSeleccionado);
    estado.elementoSeleccionado = null;
    estado.arrastrandoImagen = null;
    dibujarPizarron(estado);
    actualizarEstadoGuardadoPizarron(estado);
    actualizarBotonEliminarSeleccion(estado);
}

function actualizarBotonEliminarSeleccion(estado) {
    if (!estado.botonEliminarSeleccion || !estado.canvas) return;

    if (!estado.elementoSeleccionado || estado.modo !== 'seleccionar') {
        estado.botonEliminarSeleccion.classList.add('oculto');
        return;
    }

    const caja = obtenerCajaElemento(estado.elementoSeleccionado);
    const escalaX = estado.canvas.clientWidth / estado.canvas.width;
    const escalaY = estado.canvas.clientHeight / estado.canvas.height;
    const left = estado.canvas.offsetLeft + ((caja.x + caja.ancho) * escalaX) - 16;
    const top = estado.canvas.offsetTop + (caja.y * escalaY) - 16;

    estado.botonEliminarSeleccion.style.left = `${Math.max(6, left)}px`;
    estado.botonEliminarSeleccion.style.top = `${Math.max(6, top)}px`;
    estado.botonEliminarSeleccion.classList.remove('oculto');
}

function ajustarCanvas(estado) {
    if (!estado.canvas) return;

    const rect = estado.canvas.getBoundingClientRect();
    estado.canvas.width = Math.max(320, Math.floor(rect.width));
    estado.canvas.height = Math.max(320, Math.floor(rect.height));
    dibujarPizarron(estado);
    actualizarBotonEliminarSeleccion(estado);
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
