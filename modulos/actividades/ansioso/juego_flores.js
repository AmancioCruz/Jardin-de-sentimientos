import { contenedores } from "../../../nucleo/contenedores_dom.js";
import { construirElemento } from "../../../utilidades/constructor_elementos.js";
import { mostrarTutorialActividad } from "../../../componentes/tutorial_actividad/tutorial_actividad.js";

const duracionesJuego = [
    { etiqueta: '30 s', valor: 30 * 1000 },
    { etiqueta: '1 min', valor: 60 * 1000 },
    { etiqueta: '1:30 min', valor: 90 * 1000 }
];
const pensamientosBase = [
    { texto: 'agotamiento', archivo: 'agotamiento.png' },
    { texto: 'autoexigencia', archivo: 'autoexigencia.png' },
    { texto: 'comparacion academica', archivo: 'comparacion_academica.png' },
    { texto: 'desmotivacion', archivo: 'desmotivacion.png' },
    { texto: 'exigencia academica', archivo: 'exigencia_academica.png' },
    { texto: 'falta de tiempo', archivo: 'falta_tiempo.png' },
    { texto: 'frustracion', archivo: 'frustracion.png' },
    { texto: 'inseguridad', archivo: 'inseguridad.png' },
    { texto: 'material pendiente', archivo: 'material_pendiente.png' },
    { texto: 'perfeccionismo', archivo: 'perfeccionismo.png' },
    { texto: 'procrastinacion', archivo: 'procastinacion.png' },
    { texto: 'responsabilidades', archivo: 'responsabilidades.png' },
    { texto: 'saturacion mental', archivo: 'saturacion_mental.png' },
    { texto: 'sobrecarga academica', archivo: 'sobrecarga_academica.png' },
    { texto: 'tesis', archivo: 'tesis.png' }
];

export function inicializarJuegoFlores({ alSalir } = {}) {
    const estado = crearEstadoJuego();
    estado.recursos = cargarRecursosJuego();
    const vista = crearVistaJuego(finalizar);

    vista.montar(contenedores.contenido, true);

    const canvas = vista.nodo.querySelector('#juego-flores-canvas');
    const marcador = vista.nodo.querySelector('[data-marcador]');
    const mensaje = vista.nodo.querySelector('[data-mensaje]');
    const panelFinal = vista.nodo.querySelector('[data-panel-final]');
    const panelDuracion = vista.nodo.querySelector('[data-panel-duracion]');
    const tituloFinal = vista.nodo.querySelector('[data-titulo-final]');
    const textoFinal = vista.nodo.querySelector('[data-texto-final]');
    const botonFinal = vista.nodo.querySelector('[data-boton-final]');
    const ctx = canvas.getContext('2d');
    redibujarCuandoCarguenRecursos(estado, () => {
        if (!estado.juegoIniciado) dibujar(ctx, estado);
    });

    function finalizar() {
        limpiar();
        if (typeof alSalir === 'function') alSalir(canvas);
    }

    function limpiar() {
        estado.activo = false;
        estado.bucleActivo = false;
        window.removeEventListener('resize', ajustarCanvas);
        window.removeEventListener('keydown', controlarTeclado);
    }

    function ajustarCanvas() {
        const rect = canvas.getBoundingClientRect();
        const escala = window.devicePixelRatio || 1;

        canvas.width = Math.max(320, Math.floor(rect.width * escala));
        canvas.height = Math.max(360, Math.floor(rect.height * escala));
        ctx.setTransform(escala, 0, 0, escala, 0, 0);

        estado.ancho = rect.width;
        estado.alto = rect.height;
        estado.regadera.imagen = estado.recursos?.manguera || null;
        estado.regadera.x = limitar(estado.regadera.x || estado.ancho / 2, 44, estado.ancho - 72);
        estado.regadera.y = limitar(estado.regadera.y || estado.alto - 40, 74, estado.alto - 34);
        estado.flor.x = estado.ancho / 2;
        estado.flor.y = estado.alto - 38;
    }

    function controlarTeclado(evento) {
        if (evento.key === 'ArrowLeft') estado.regadera.x -= 24;
        if (evento.key === 'ArrowRight') estado.regadera.x += 24;
        if (evento.key === 'ArrowUp') estado.regadera.y -= 24;
        if (evento.key === 'ArrowDown') estado.regadera.y += 24;
        if (evento.key === ' ' || evento.key === 'Enter') dispararGota();
        estado.regadera.x = limitar(estado.regadera.x, 44, estado.ancho - 72);
        estado.regadera.y = limitar(estado.regadera.y, 74, estado.alto - 34);
    }

    function apuntar(evento) {
        const rect = canvas.getBoundingClientRect();
        estado.regadera.x = limitar(evento.clientX - rect.left, 44, estado.ancho - 72);
        estado.regadera.y = limitar(evento.clientY - rect.top, 74, estado.alto - 34);
    }

    function dispararGota() {
        const ahora = performance.now();
        if (!estado.juegoIniciado || estado.terminado || ahora - estado.ultimoDisparo < 210) return;
        const punta = obtenerPuntaManguera(estado.regadera);

        estado.gotas.push({
            x: punta.x,
            y: punta.y,
            radio: 5,
            velocidad: 8.2
        });
        estado.ultimoDisparo = ahora;
    }

    function actualizar(tiempo) {
        if (!estado.activo) return;

        const delta = Math.min(34, tiempo - estado.tiempoAnterior);
        estado.tiempoAnterior = tiempo;

        if (!estado.juegoIniciado) {
            dibujar(ctx, estado);
            actualizarInterfaz(estado, marcador, mensaje);
            requestAnimationFrame(actualizar);
            return;
        }

        estado.progreso = limitar((tiempo - estado.inicio) / estado.duracionMs, 0, 1);

        if (!estado.terminado) {
            generarPensamiento(estado, tiempo);
            moverElementos(estado, delta);
            revisarColisiones(estado);
            actualizarFlor(estado, delta);
        }

        if (estado.progreso >= 1 && !estado.terminado) {
            finalizarPartida(estado, 'ganado', 'Lo lograste. La flor se mantuvo creciendo durante esta pausa.');
        }

        dibujar(ctx, estado);
        actualizarInterfaz(estado, marcador, mensaje);
        actualizarPanelFinal(estado, panelFinal, tituloFinal, textoFinal, botonFinal);
        requestAnimationFrame(actualizar);
    }

    canvas.addEventListener('pointermove', apuntar);
    canvas.addEventListener('pointerdown', (evento) => {
        apuntar(evento);
        dispararGota();
    });
    window.addEventListener('keydown', controlarTeclado);
    window.addEventListener('resize', ajustarCanvas);
    botonFinal.addEventListener('click', () => {
        if (estado.resultado === 'ganado') {
            finalizar();
            return;
        }

        reiniciarPartida(estado, panelFinal);
        ajustarCanvas();
        mostrarSelectorDuracion();
    });

    panelDuracion?.querySelectorAll('[data-duracion-juego]').forEach((boton) => {
        boton.addEventListener('click', () => {
            iniciarConDuracion(Number(boton.dataset.duracionJuego));
        });
    });

    function iniciarAnimacion() {
        if (estado.bucleActivo) return;
        estado.bucleActivo = true;
        requestAnimationFrame(actualizar);
    }

    function mostrarSelectorDuracion() {
        vista.nodo.classList.add('juego-en-espera');
        panelDuracion?.classList.remove('oculto');
        marcador.classList.add('oculto');
        dibujar(ctx, estado);
    }

    function iniciarConDuracion(duracionMs) {
        vista.nodo.classList.remove('juego-en-espera');
        panelDuracion?.classList.add('oculto');
        marcador.classList.remove('oculto');
        estado.duracionMs = duracionMs || duracionesJuego[1].valor;
        estado.inicio = performance.now();
        estado.tiempoAnterior = estado.inicio;
        estado.juegoIniciado = true;
        iniciarAnimacion();
    }

    ajustarCanvas();
    dibujar(ctx, estado);
    const prepararJuego = () => mostrarSelectorDuracion();
    const tutorial = mostrarTutorialActividad({
        id: 'juego-flores',
        titulo: 'Guía rápida del juego',
        descripcion: 'La idea no es ganar perfecto, sino practicar una pausa mientras cuidas la flor.',
        pasos: [
            { icono: 'fa-solid fa-computer-mouse', texto: 'Mueve la manguera con el cursor o con el dedo en móvil.' },
            { icono: 'fa-solid fa-droplet', texto: 'Toca o haz clic para lanzar gotas desde la punta de la manguera.' },
            { icono: 'fa-solid fa-seedling', texto: 'Evita que los pensamientos lleguen a la flor.' },
            { icono: 'fa-solid fa-heart', texto: 'El marcador muestra tiempo y cuidado restante.' },
            { icono: 'fa-solid fa-check', texto: 'Terminar guarda la actividad después de responder cómo te sientes.' }
        ],
        alCerrar: prepararJuego
    });

    if (!tutorial) prepararJuego();

    return limpiar;
}

function crearVistaJuego(alSalir) {
    return construirElemento({
        tipo: 'section',
        atributos: { class: 'actividad-juego actividad-flores' },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'actividad-panel-superior' },
                hijos: [
                    {
                        tipo: 'div',
                        hijos: [
                            { tipo: 'h1', hijos: ['Riega tu calma'] },
                            {
                                tipo: 'p',
                                atributos: { 'data-mensaje': '' },
                                hijos: ['Mueve la regadera y disuelve pensamientos antes de que alcancen la flor.']
                            }
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
            },
            {
                tipo: 'canvas',
                atributos: {
                    id: 'juego-flores-canvas',
                    class: 'canvas-actividad canvas-juego-flores'
                }
            },
            {
                tipo: 'div',
                atributos: { class: 'actividad-marcador', 'data-marcador': '' },
                hijos: ['Tiempo: 1:30 | Cuidado: 5/5']
            },
            {
                tipo: 'div',
                atributos: { class: 'panel-final-juego oculto', 'data-panel-final': '' },
                hijos: [
                    { tipo: 'h2', atributos: { 'data-titulo-final': '' }, hijos: ['Momento de pausar'] },
                    { tipo: 'p', atributos: { 'data-texto-final': '' }, hijos: ['Respira profundo y vuelve a intentarlo cuando te sientas listo.'] },
                    {
                        tipo: 'button',
                        atributos: { type: 'button', class: 'btn-actividad-salir', 'data-boton-final': '' },
                        hijos: ['Reintentar']
                    }
                ]
            },
            {
                tipo: 'div',
                atributos: { class: 'panel-final-juego selector-duracion-juego oculto', 'data-panel-duracion': '' },
                hijos: [
                    { tipo: 'h2', hijos: ['Elige tu pausa'] },
                    { tipo: 'p', hijos: ['Selecciona cuánto tiempo quieres cuidar la flor.'] },
                    {
                        tipo: 'div',
                        atributos: { class: 'selector-duracion-juego__opciones' },
                        hijos: duracionesJuego.map((duracion) => ({
                            tipo: 'button',
                            atributos: {
                                type: 'button',
                                class: 'btn-actividad-salir',
                                'data-duracion-juego': duracion.valor
                            },
                            hijos: [duracion.etiqueta]
                        }))
                    }
                ]
            }
        ]
    });
}

function crearEstadoJuego() {
    return {
        activo: true,
        bucleActivo: false,
        juegoIniciado: false,
        terminado: false,
        resultado: '',
        panelMostrado: false,
        mensajeFinal: '',
        ancho: 0,
        alto: 0,
        inicio: 0,
        tiempoAnterior: performance.now(),
        duracionMs: duracionesJuego[1].valor,
        ultimoDisparo: 0,
        ultimoPensamiento: 0,
        progreso: 0,
        danos: 0,
        maximoDanos: 5,
        racha: 0,
        regadera: { x: 180, y: 300 },
        flor: { x: 180, y: 280, crecimiento: 0.02, brillo: 0, sacudida: 0, anchoVisible: 96, altoVisible: 170 },
        gotas: [],
        pensamientos: [],
        particulas: [],
        recursos: null
    };
}

function cargarRecursosJuego() {
    return {
        flor: [1, 2, 3, 4].map((numero) => cargarImagen(`./recursos/flor/${numero}.png`)),
        manguera: cargarImagen('./recursos/manguera/manguera.png'),
        sol: cargarImagen('./recursos/sol.png'),
        pasto: cargarImagen('./recursos/pasto.png'),
        enemigos: Object.fromEntries(pensamientosBase.map((pensamiento) => [
            pensamiento.archivo,
            cargarImagen(`./recursos/enemigos/${pensamiento.archivo}`)
        ]))
    };
}

function cargarImagen(ruta) {
    const imagen = new Image();
    imagen.src = new URL(ruta, import.meta.url).href;
    return imagen;
}

function redibujarCuandoCarguenRecursos(estado, alCargar) {
    const imagenes = [
        ...(estado.recursos?.flor || []),
        estado.recursos?.manguera,
        estado.recursos?.sol,
        estado.recursos?.pasto,
        ...Object.values(estado.recursos?.enemigos || {})
    ].filter(Boolean);

    imagenes.forEach((imagen) => {
        if (imagen.complete) return;
        imagen.addEventListener('load', alCargar, { once: true });
    });
}

function generarPensamiento(estado, tiempo) {
    const intervalo = 2300 - (estado.progreso * 650);
    if (tiempo - estado.ultimoPensamiento < intervalo) return;

    const plantilla = pensamientosBase[Math.floor(Math.random() * pensamientosBase.length)];
    const tamano = 25 + Math.random() * 6;
    const tamanoSprite = tamano * 3.45;

    estado.pensamientos.push({
        ...plantilla,
        x: 34 + Math.random() * Math.max(1, estado.ancho - 68),
        y: -32,
        radio: tamano,
        ancho: tamanoSprite,
        alto: tamanoSprite,
        velocidad: 0.42 + (estado.progreso * 0.62) + Math.random() * 0.22,
        deriva: (Math.random() - 0.5) * 0.55,
        seguimiento: 0.01 + (estado.progreso * 0.015),
        semilla: Math.random() * 1000,
        imagen: estado.recursos?.enemigos?.[plantilla.archivo] || null,
        alfa: 1,
        disolviendo: false
    });
    estado.ultimoPensamiento = tiempo;
}

function moverElementos(estado, delta) {
    const factor = delta / 16;

    estado.gotas.forEach((gota) => {
        gota.y -= gota.velocidad * factor;
    });

    estado.pensamientos.forEach((pensamiento) => {
        if (pensamiento.disolviendo) {
            pensamiento.alfa -= 0.05 * factor;
            pensamiento.y -= 0.35 * factor;
            return;
        }

        const direccionFlor = Math.sign(estado.flor.x - pensamiento.x);
        const distanciaFlor = Math.abs(estado.flor.x - pensamiento.x);
        const impulsoHaciaFlor = direccionFlor * Math.min(1.2, distanciaFlor * pensamiento.seguimiento);

        pensamiento.y += pensamiento.velocidad * factor;
        pensamiento.x += (impulsoHaciaFlor + pensamiento.deriva + Math.sin((pensamiento.y + pensamiento.semilla) * 0.018) * 0.18) * factor;
    });

    estado.particulas.forEach((particula) => {
        particula.x += particula.vx * factor;
        particula.y += particula.vy * factor;
        particula.alfa -= 0.025 * factor;
        particula.radio *= 0.99;
    });

    estado.gotas = estado.gotas.filter((gota) => gota.y > -20);
    estado.pensamientos = estado.pensamientos.filter((pensamiento) => pensamiento.alfa > 0.02 && pensamiento.y < estado.alto + 80);
    estado.particulas = estado.particulas.filter((particula) => particula.alfa > 0.02);
}

function revisarColisiones(estado) {
    estado.gotas.forEach((gota) => {
        estado.pensamientos.forEach((pensamiento) => {
            if (pensamiento.disolviendo) return;

            if (distancia(gota, pensamiento) < pensamiento.radio + gota.radio) {
                pensamiento.disolviendo = true;
                gota.y = -100;
                estado.racha += 1;
                estado.flor.brillo = 1;
                estado.flor.crecimiento = limitar(estado.flor.crecimiento + 0.012, 0.02, 1);
                crearParticulasAgua(estado, pensamiento.x, pensamiento.y);
            }
        });
    });

    estado.pensamientos.forEach((pensamiento) => {
        if (pensamiento.disolviendo) return;

        const zonaFlor = obtenerZonaColisionFlor(estado);

        if (distancia(pensamiento, zonaFlor) < pensamiento.radio + zonaFlor.radio) {
            pensamiento.disolviendo = true;
            estado.racha = 0;
            estado.danos += 1;
            estado.flor.sacudida = 1;
            crearParticulasImpacto(estado, pensamiento.x, pensamiento.y);

            if (estado.danos >= estado.maximoDanos) {
                finalizarPartida(estado, 'pausa', 'La flor necesita una pausa. Respira profundo y vuelve a intentarlo cuando te sientas listo.');
            }
        }
    });
}

function finalizarPartida(estado, resultado, mensaje) {
    estado.terminado = true;
    estado.resultado = resultado;
    estado.mensajeFinal = mensaje;
}

function reiniciarPartida(estado, panelFinal) {
    const recursos = estado.recursos;
    Object.assign(estado, crearEstadoJuego(), { recursos });
    panelFinal?.classList.add('oculto');
}

function actualizarPanelFinal(estado, panelFinal, tituloFinal, textoFinal, botonFinal) {
    if (!estado.terminado || !estado.mensajeFinal || estado.panelMostrado) return;

    estado.panelMostrado = true;
    panelFinal?.classList.remove('oculto');
    tituloFinal.textContent = estado.resultado === 'ganado'
        ? 'Pausa completada'
        : 'Momento de pausar';
    textoFinal.textContent = estado.mensajeFinal;
    botonFinal.textContent = estado.resultado === 'ganado'
        ? 'Terminar'
        : 'Reintentar';
}

function actualizarFlor(estado, delta) {
    const factor = delta / 16;
    const crecimientoPorTiempo = 0.00042 * factor;

    estado.flor.crecimiento = limitar(estado.flor.crecimiento + crecimientoPorTiempo, 0.02, 1);
    estado.flor.brillo = Math.max(0, estado.flor.brillo - 0.025 * factor);
    estado.flor.sacudida = Math.max(0, estado.flor.sacudida - 0.05 * factor);
}

function actualizarInterfaz(estado, marcador, mensaje) {
    if (!estado.juegoIniciado) {
        mensaje.textContent = 'Antes de empezar, selecciona una duración para esta pausa.';
        return;
    }

    const restante = Math.max(0, estado.duracionMs - ((performance.now() - estado.inicio)));
    const minutos = Math.floor(restante / 60000);
    const segundos = String(Math.floor((restante % 60000) / 1000)).padStart(2, '0');

    marcador.textContent = `Tiempo: ${minutos}:${segundos} | Cuidado: ${Math.max(0, estado.maximoDanos - estado.danos)}/${estado.maximoDanos}`;

    if (estado.mensajeFinal) {
        mensaje.textContent = estado.mensajeFinal;
        return;
    }

    if (estado.racha >= 8) {
        mensaje.textContent = 'Buen ritmo: la flor esta brillando con tu constancia.';
        return;
    }

    if (estado.danos > 0) {
        mensaje.textContent = 'La flor recibio tension. Sigue con calma, una gota a la vez.';
        return;
    }

    mensaje.textContent = 'Mueve la regadera y disuelve pensamientos antes de que alcancen la flor.';
}

function dibujar(ctx, estado) {
    ctx.clearRect(0, 0, estado.ancho, estado.alto);
    dibujarFondo(ctx, estado);
    dibujarProgreso(ctx, estado);
    dibujarFlor(ctx, estado);
    estado.particulas.forEach((particula) => dibujarParticula(ctx, particula));
    estado.gotas.forEach((gota) => dibujarGota(ctx, gota));
    estado.pensamientos.forEach((pensamiento) => dibujarPensamiento(ctx, pensamiento));
    dibujarRegadera(ctx, estado.regadera);
}

function dibujarFondo(ctx, estado) {
    const gradiente = ctx.createLinearGradient(0, 0, 0, estado.alto);
    gradiente.addColorStop(0, '#f7fbff');
    gradiente.addColorStop(0.5, '#fbfff6');
    gradiente.addColorStop(1, '#edf7ee');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, estado.ancho, estado.alto);

    dibujarSol(ctx, estado);

    ctx.fillStyle = 'rgba(22, 78, 63, 0.08)';
    ctx.fillRect(0, estado.alto - 34, estado.ancho, 34);
    dibujarPasto(ctx, estado);
}

function dibujarSol(ctx, estado) {
    const imagen = estado.recursos?.sol;
    const tamano = Math.min(Math.max(estado.ancho * 0.22, 82), 126);
    const x = Math.max(20, estado.ancho * 0.08);
    const y = Math.max(18, estado.alto * 0.06);

    if (imagen?.complete && imagen.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.drawImage(imagen, x, y, tamano, tamano);
        ctx.restore();
        return;
    }

    ctx.fillStyle = 'rgba(255, 210, 90, 0.22)';
    ctx.beginPath();
    ctx.arc(x + (tamano / 2), y + (tamano / 2), tamano / 2, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarPasto(ctx, estado) {
    const imagen = estado.recursos?.pasto;
    const altoDecoracion = Math.max(54, Math.min(92, estado.alto * 0.16));

    if (imagen?.complete && imagen.naturalWidth > 0) {
        const proporcion = imagen.naturalWidth / imagen.naturalHeight;
        const grupos = [
            { x: 0.08, escala: 1.05, elevacion: 0 },
            { x: 0.46, escala: 0.82, elevacion: 4 },
            { x: 0.78, escala: 1.12, elevacion: -2 }
        ];

        grupos.forEach((grupo) => {
            const alto = altoDecoracion * grupo.escala;
            const ancho = alto * proporcion;
            const x = (estado.ancho * grupo.x) - (ancho / 2);
            const y = estado.alto - alto - grupo.elevacion;

            ctx.drawImage(imagen, x, y, ancho, alto);
        });
        return;
    }

    ctx.fillStyle = 'rgba(31, 111, 91, 0.18)';
    ctx.fillRect(estado.ancho * 0.05, estado.alto - altoDecoracion, estado.ancho * 0.18, altoDecoracion);
    ctx.fillRect(estado.ancho * 0.72, estado.alto - altoDecoracion * 1.05, estado.ancho * 0.22, altoDecoracion * 1.05);
}

function dibujarProgreso(ctx, estado) {
    const margen = 20;
    const ancho = estado.ancho - (margen * 2);

    ctx.fillStyle = 'rgba(22, 78, 63, 0.08)';
    redondearRect(ctx, margen, 14, ancho, 7, 999);
    ctx.fill();

    ctx.fillStyle = 'rgba(31, 111, 91, 0.45)';
    redondearRect(ctx, margen, 14, ancho * estado.progreso, 7, 999);
    ctx.fill();
}

function dibujarRegadera(ctx, regadera) {
    ctx.save();
    ctx.translate(regadera.x, regadera.y);

    const imagen = regadera.imagen;
    if (imagen?.complete && imagen.naturalWidth > 0) {
        const ancho = 58;
        const alto = ancho * (imagen.naturalHeight / imagen.naturalWidth);
        ctx.drawImage(imagen, -ancho / 2, -alto + 16, ancho, alto);
        ctx.restore();
        return;
    }

    /* Punta sencilla de manguera: más clara que una regadera completa en pantalla pequeña. */
    ctx.fillStyle = '#1f6f5b';
    ctx.strokeStyle = '#1f6f5b';
    ctx.lineWidth = 2.5;
    redondearRect(ctx, -25, -11, 42, 22, 11);
    ctx.fill();

    ctx.fillStyle = '#83c9f4';
    redondearRect(ctx, 3, -8, 26, 16, 8);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(22, 78, 63, 0.55)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.quadraticCurveTo(-42, 12, -58, 4);
    ctx.stroke();

    ctx.fillStyle = '#dff1e8';
    ctx.beginPath();
    ctx.arc(30, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function obtenerPuntaManguera(regadera) {
    return {
        x: regadera.x - 18,
        y: regadera.y - 32
    };
}

function dibujarGota(ctx, gota) {
    ctx.save();
    ctx.translate(gota.x, gota.y);
    ctx.fillStyle = 'rgba(77, 166, 235, 0.86)';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(8, 2, 0, 10);
    ctx.quadraticCurveTo(-8, 2, 0, -8);
    ctx.fill();
    ctx.restore();
}

function dibujarPensamiento(ctx, pensamiento) {
    ctx.save();
    ctx.globalAlpha = pensamiento.alfa;
    ctx.translate(pensamiento.x, pensamiento.y);

    const radio = pensamiento.radio;
    const tamanoImagen = pensamiento.ancho || radio * 3;
    if (pensamiento.imagen?.complete && pensamiento.imagen.naturalWidth > 0) {
        ctx.drawImage(pensamiento.imagen, -tamanoImagen / 2, -tamanoImagen / 2, tamanoImagen, tamanoImagen);
        ctx.restore();
        return;
    }

    const color = pensamiento.disolviendo ? 'rgba(131, 201, 244, 0.34)' : pensamiento.color;
    ctx.fillStyle = color;
    ctx.strokeStyle = pensamiento.disolviendo ? 'rgba(77, 166, 235, 0.42)' : 'rgba(124, 45, 64, 0.34)';
    ctx.lineWidth = 2.5;
    redondearRect(ctx, -radio * 1.25, -radio * 0.88, radio * 2.5, radio * 1.76, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = pensamiento.disolviendo ? 'rgba(22, 78, 63, 0.48)' : '#ffffff';
    ctx.font = `900 ${Math.max(14, radio * 0.8)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pensamiento.icono, 0, -radio * 0.2);

    ctx.fillStyle = pensamiento.disolviendo ? 'rgba(33, 49, 44, 0.42)' : 'rgba(33, 49, 44, 0.86)';
    ctx.font = `800 ${Math.max(8, radio * 0.34)}px sans-serif`;
    envolverTextoCentrado(ctx, pensamiento.texto, 0, radio + 9, radio * 3.2, 11);
    ctx.restore();
}

function dibujarFlor(ctx, estado) {
    const { flor } = estado;
    const crecimiento = flor.crecimiento;
    const sacudida = Math.sin(performance.now() * 0.08) * flor.sacudida * 5;

    ctx.save();
    ctx.translate(flor.x + sacudida, flor.y);

    if (flor.brillo > 0) {
        ctx.fillStyle = `rgba(255, 210, 90, ${0.18 * flor.brillo})`;
        ctx.beginPath();
        ctx.arc(0, -78, 68 + (flor.brillo * 22), 0, Math.PI * 2);
        ctx.fill();
    }

    dibujarBaseTierra(ctx);

    if (dibujarFlorDesdeRecursos(ctx, estado, crecimiento)) {
        ctx.restore();
        return;
    }

    if (crecimiento < 0.2) {
        dibujarEtapaSemilla(ctx, crecimiento / 0.2);
        ctx.restore();
        return;
    }

    if (crecimiento < 0.48) {
        dibujarBrote(ctx, (crecimiento - 0.2) / 0.28);
        ctx.restore();
        return;
    }

    if (crecimiento < 0.76) {
        dibujarBoton(ctx, (crecimiento - 0.48) / 0.28);
        ctx.restore();
        return;
    }

    dibujarFlorAbierta(ctx, (crecimiento - 0.76) / 0.24);
    ctx.restore();
}

function dibujarFlorDesdeRecursos(ctx, estado, crecimiento) {
    const etapa = obtenerEtapaFlor(crecimiento);
    const imagen = estado.recursos?.flor?.[etapa.indice];

    if (!imagen?.complete || imagen.naturalWidth <= 0) return false;

    const anchoFinal = Math.min(Math.max(estado.ancho * 0.17, 66), 108);
    const ancho = anchoFinal * etapa.escala;
    const alto = ancho * (imagen.naturalHeight / imagen.naturalWidth);
    estado.flor.anchoVisible = ancho;
    estado.flor.altoVisible = alto;

    ctx.drawImage(imagen, -ancho / 2, -alto + 10, ancho, alto);
    return true;
}

function obtenerEtapaFlor(crecimiento) {
    if (crecimiento < 0.2) {
        return { indice: 0, escala: 0.5 + ((crecimiento / 0.2) * 0.1) };
    }

    if (crecimiento < 0.48) {
        return { indice: 1, escala: 0.62 + (((crecimiento - 0.2) / 0.28) * 0.1) };
    }

    if (crecimiento < 0.76) {
        return { indice: 2, escala: 0.78 + (((crecimiento - 0.48) / 0.28) * 0.08) };
    }

    return { indice: 3, escala: 0.88 + (((crecimiento - 0.76) / 0.24) * 0.08) };
}

function obtenerZonaColisionFlor(estado) {
    const ancho = estado.flor.anchoVisible || 96;
    const alto = estado.flor.altoVisible || 170;

    return {
        x: estado.flor.x,
        y: estado.flor.y - (alto * 0.52),
        radio: Math.max(24, Math.min(ancho * 0.46, alto * 0.28))
    };
}

function dibujarBaseTierra(ctx) {
    ctx.fillStyle = 'rgba(22, 78, 63, 0.10)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 62, 13, 0, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarEtapaSemilla(ctx, progreso) {
    const escala = 0.75 + (progreso * 0.35);

    ctx.save();
    ctx.scale(escala, escala);
    ctx.fillStyle = '#8a5a34';
    ctx.beginPath();
    ctx.ellipse(0, -6, 13, 18, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-2, -9, 7, Math.PI * 1.15, Math.PI * 1.82);
    ctx.stroke();
    ctx.restore();
}

function dibujarBrote(ctx, progreso) {
    const altoTallo = 38 + (progreso * 44);

    ctx.strokeStyle = '#1f6f5b';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(-4, -16, 5, -34, 0, -altoTallo);
    ctx.stroke();

    ctx.fillStyle = '#16877f';
    ctx.beginPath();
    ctx.ellipse(-18, -14, 19 * progreso, 9 * progreso, -0.65, 0, Math.PI * 2);
    ctx.ellipse(18, -24, 19 * progreso, 9 * progreso, 0.65, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarBoton(ctx, progreso) {
    dibujarBrote(ctx, 1);

    const yBoton = -88;
    const radio = 16 + (progreso * 14);

    ctx.fillStyle = '#e80c78';
    ctx.beginPath();
    ctx.ellipse(0, yBoton, radio * 0.78, radio, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.beginPath();
    ctx.ellipse(-5, yBoton - 7, radio * 0.28, radio * 0.42, -0.4, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarFlorAbierta(ctx, progreso) {
    const apertura = 0.75 + (progreso * 0.25);
    const altoCentral = 128;

    ctx.strokeStyle = '#11867d';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-6, -38, 8, -84, 0, -altoCentral);
    ctx.stroke();

    dibujarHojasGrandes(ctx, apertura);
    dibujarRamaLateral(ctx, -1, apertura);
    dibujarRamaLateral(ctx, 1, apertura);
    dibujarCabezaFlor(ctx, 0, -altoCentral - 34, 44 * apertura, 58 * apertura);
}

function dibujarHojasGrandes(ctx, apertura) {
    ctx.fillStyle = '#16877f';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(-62 * apertura, -46, -74 * apertura, -98, -32 * apertura, -72);
    ctx.bezierCurveTo(-18 * apertura, -54, -8, -28, 0, -8);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(64 * apertura, -50, 76 * apertura, -102, 34 * apertura, -76);
    ctx.bezierCurveTo(18 * apertura, -56, 8, -28, 0, -8);
    ctx.fill();
}

function dibujarRamaLateral(ctx, direccion, apertura) {
    ctx.strokeStyle = '#11867d';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.bezierCurveTo(
        direccion * 16 * apertura,
        -72,
        direccion * 42 * apertura,
        -88,
        direccion * 56 * apertura,
        -112
    );
    ctx.stroke();

    dibujarCabezaFlor(ctx, direccion * 61 * apertura, -118, 18 * apertura, 18 * apertura);
}

function dibujarCabezaFlor(ctx, x, y, ancho, alto) {
    ctx.fillStyle = '#e80c78';
    ctx.beginPath();
    ctx.ellipse(x, y, ancho, alto, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.ellipse(x - ancho * 0.28, y - alto * 0.22, ancho * 0.28, alto * 0.34, -0.4, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarParticula(ctx, particula) {
    ctx.save();
    ctx.globalAlpha = particula.alfa;
    ctx.fillStyle = particula.color;
    ctx.beginPath();
    ctx.arc(particula.x, particula.y, particula.radio, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function crearParticulasAgua(estado, x, y) {
    for (let i = 0; i < 12; i++) {
        estado.particulas.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 3.4,
            vy: (Math.random() - 0.5) * 3.4,
            radio: 2 + Math.random() * 4,
            alfa: 0.85,
            color: 'rgba(77, 166, 235, 0.72)'
        });
    }
}

function crearParticulasImpacto(estado, x, y) {
    for (let i = 0; i < 10; i++) {
        estado.particulas.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2.3,
            vy: (Math.random() - 0.5) * 2.3,
            radio: 2 + Math.random() * 3,
            alfa: 0.65,
            color: 'rgba(255, 141, 115, 0.54)'
        });
    }
}

function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
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

function envolverTextoCentrado(ctx, texto, x, y, anchoMaximo, altoLinea, maximoLineas = 2) {
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

    lineas.slice(0, maximoLineas).forEach((linea, indice) => {
        ctx.fillText(linea, x, y + (indice * altoLinea));
    });
}

function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}
