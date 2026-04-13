import { coloresPrioridad } from "./paleta_notas.js";

export class Nota {
    constructor(ancho, alto, x = 0, y = 0, prioridad = '', contenido = {}) {
        this.ancho = ancho;
        this.alto = alto;
        this.x = x;
        this.y = y;
        this.prioridad = prioridad;
        this.contenido = normalizarContenido(contenido);
    }

    static desdeDatos(datos = {}) {
        return new Nota(
            datos.ancho || 180,
            datos.alto || 155,
            datos.x || 0,
            datos.y || 0,
            datos.prioridad || '',
            datos.contenido || {}
        );
    }

    aDatos() {
        return {
            ancho: this.ancho,
            alto: this.alto,
            x: this.x,
            y: this.y,
            prioridad: this.prioridad,
            contenido: this.contenido
        };
    }

    actualizarContenido(contenido = {}) {
        this.contenido = normalizarContenido(contenido);
    }

    obtenerPaleta() {
        switch (this.prioridad) {
            case 'alta':
                return coloresPrioridad.alta;
            case 'media':
                return coloresPrioridad.media;
            case 'baja':
                return coloresPrioridad.baja;
            default:
                return coloresPrioridad.default;
        }
    }

    dibujar(ctx, seleccionada = false) {
        const colores = this.obtenerPaleta();
        const centroX = this.x + (this.ancho / 2);
        const centroY = this.y + (this.alto / 2);
        const altoFranja = Math.max(18, this.alto * 0.17);

        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(-0.04);
        ctx.translate(-centroX, -centroY);

        /* Nota sencilla tipo post-it: cuerpo, franja superior y sombra suave. */
        ctx.fillStyle = colores.frente;
        ctx.shadowColor = colores.sombra;
        ctx.shadowBlur = 16;
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 12;
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);

        ctx.shadowColor = "transparent";
        ctx.fillStyle = colores.franja;
        ctx.fillRect(this.x, this.y, this.ancho, altoFranja);

        this.dibujarContenido(ctx, altoFranja);

        if (this.prioridad) {
            this.dibujarStickerPrioridad(ctx, colores);
        }

        this.dibujarBotonEditar(ctx);
        this.dibujarBotonEliminar(ctx);

        if (seleccionada) {
            this.dibujarSeleccion(ctx);
        }

        ctx.restore();
    }

    obtenerAreaEliminar() {
        const radio = Math.max(10, Math.min(14, this.ancho * 0.08));

        return {
            x: this.x + this.ancho - radio - 7,
            y: this.y + radio + 7,
            radio
        };
    }

    obtenerAreaEditar() {
        const areaEliminar = this.obtenerAreaEliminar();
        const radio = areaEliminar.radio;

        return {
            x: areaEliminar.x - (radio * 2) - 7,
            y: areaEliminar.y,
            radio
        };
    }

    contienePuntoEliminar(x, y) {
        const area = this.obtenerAreaEliminar();
        const distanciaX = x - area.x;
        const distanciaY = y - area.y;

        return Math.sqrt((distanciaX ** 2) + (distanciaY ** 2)) <= area.radio + 4;
    }

    contienePuntoEditar(x, y) {
        const area = this.obtenerAreaEditar();
        const distanciaX = x - area.x;
        const distanciaY = y - area.y;

        return Math.sqrt((distanciaX ** 2) + (distanciaY ** 2)) <= area.radio + 4;
    }

    dibujarBotonEditar(ctx) {
        const area = this.obtenerAreaEditar();

        ctx.save();
        ctx.fillStyle = "#facc15";
        ctx.shadowColor = "rgba(22, 78, 63, 0.16)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.arc(area.x, area.y, area.radio, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#164e3f";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(area.x - 5, area.y + 4);
        ctx.lineTo(area.x + 4, area.y - 5);
        ctx.moveTo(area.x + 1, area.y - 6);
        ctx.lineTo(area.x + 6, area.y - 1);
        ctx.moveTo(area.x - 6, area.y + 5);
        ctx.lineTo(area.x - 2, area.y + 4);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(area.x, area.y, area.radio - 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    dibujarBotonEliminar(ctx) {
        const area = this.obtenerAreaEliminar();

        ctx.save();
        ctx.fillStyle = "rgba(220, 38, 38, 0.92)";
        ctx.beginPath();
        ctx.arc(area.x, area.y, area.radio, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(area.x - 4, area.y - 4);
        ctx.lineTo(area.x + 4, area.y + 4);
        ctx.moveTo(area.x + 4, area.y - 4);
        ctx.lineTo(area.x - 4, area.y + 4);
        ctx.stroke();
        ctx.restore();
    }

    dibujarStickerPrioridad(ctx, colores) {
        const etiqueta = this.obtenerEtiquetaPrioridad();
        const alto = Math.max(20, Math.min(26, this.alto * 0.18));
        const ancho = Math.max(68, Math.min(92, this.ancho * 0.5));
        const x = this.x + 9;
        const y = this.y + 7;
        const radio = alto / 2;
        const iconoX = x + radio + 1;
        const textoX = x + alto + 7;

        ctx.save();
        ctx.shadowColor = "rgba(22, 78, 63, 0.12)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        redondearRect(ctx, x, y, ancho, alto, radio);
        ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.fillStyle = colores.franja;
        ctx.beginPath();
        ctx.arc(iconoX, y + radio, Math.max(7, radio - 4), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.prioridad === 'alta' ? "#ffffff" : "#21312c";
        ctx.font = `800 ${Math.max(9, radio * 0.75)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.obtenerSimboloPrioridad(), iconoX, y + radio + 0.5);

        ctx.fillStyle = "rgba(30, 49, 43, 0.9)";
        ctx.font = `800 ${Math.max(10, Math.min(12, this.ancho * 0.06))}px sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText(etiqueta, textoX, y + radio + 0.5);

        ctx.strokeStyle = "rgba(22, 78, 63, 0.08)";
        ctx.lineWidth = 2;
        redondearRect(ctx, x, y, ancho, alto, radio);
        ctx.stroke();
        ctx.restore();
    }

    obtenerSimboloPrioridad() {
        const simbolos = {
            alta: "!",
            media: "*",
            baja: "+"
        };

        return simbolos[this.prioridad] || "";
    }

    obtenerEtiquetaPrioridad() {
        const etiquetas = {
            alta: "Alta",
            media: "Media",
            baja: "Baja"
        };

        return etiquetas[this.prioridad] || "";
    }

    dibujarContenido(ctx, altoFranja) {
        if (!this.contenido.preocupacion) return;

        const margen = Math.max(10, this.ancho * 0.07);
        const xTexto = this.x + margen;
        const anchoTexto = this.ancho - (margen * 2);
        let yTexto = this.y + altoFranja + 16;
        const lineasPrincipales = this.alto < 125 ? 1 : 2;
        const lineasSecundarias = this.alto < 155 ? 1 : 2;

        ctx.save();
        ctx.shadowColor = "transparent";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        yTexto = this.dibujarBloqueTexto(ctx, "EN MENTE", this.contenido.preocupacion, xTexto, yTexto, anchoTexto, lineasPrincipales);

        if (this.contenido.estaEnMisManos === true && this.contenido.accion) {
            this.dibujarBloqueTexto(ctx, "PUEDO HACER", this.contenido.accion, xTexto, yTexto + 5, anchoTexto, lineasSecundarias);
        }

        if (this.contenido.estaEnMisManos === false && this.contenido.sentimiento) {
            this.dibujarBloqueTexto(ctx, "ME SIENTO", this.contenido.sentimiento, xTexto, yTexto + 5, anchoTexto, lineasSecundarias);
        }

        ctx.restore();
    }

    dibujarBloqueTexto(ctx, etiqueta, texto, x, y, ancho, maximoLineas) {
        const tamanoEtiqueta = Math.max(8, Math.min(10, this.ancho * 0.055));
        const tamanoTexto = Math.max(11, Math.min(14, this.ancho * 0.07));
        const altoLinea = tamanoTexto + 4;

        ctx.font = `800 ${tamanoEtiqueta}px sans-serif`;
        ctx.fillStyle = "rgba(22, 78, 63, 0.78)";
        ctx.fillText(etiqueta, x, y);

        ctx.font = `700 ${tamanoTexto}px sans-serif`;
        ctx.fillStyle = "rgba(30, 49, 43, 0.92)";

        const lineas = dividirTextoEnLineas(ctx, texto, ancho, maximoLineas);
        lineas.forEach((linea, indice) => {
            ctx.fillText(linea, x, y + 13 + (indice * altoLinea));
        });

        return y + 13 + (lineas.length * altoLinea);
    }

    dibujarSeleccion(ctx) {
        ctx.save();
        ctx.strokeStyle = "rgba(22, 78, 63, 0.72)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 5]);
        ctx.strokeRect(this.x - 5, this.y - 5, this.ancho + 10, this.alto + 10);
        ctx.restore();
    }
}

function normalizarContenido(contenido = {}) {
    return {
        preocupacion: limpiarTexto(contenido.preocupacion),
        estaEnMisManos: typeof contenido.estaEnMisManos === 'boolean'
            ? contenido.estaEnMisManos
            : null,
        accion: limpiarTexto(contenido.accion),
        sentimiento: limpiarTexto(contenido.sentimiento)
    };
}

function limpiarTexto(texto) {
    return typeof texto === 'string' ? texto.trim().replace(/\s+/g, ' ') : '';
}

function dividirTextoEnLineas(ctx, texto, anchoMaximo, maximoLineas) {
    const palabras = limpiarTexto(texto).split(' ').filter(Boolean);
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

    if (lineas.length <= maximoLineas) {
        return lineas;
    }

    const visibles = lineas.slice(0, maximoLineas);
    visibles[visibles.length - 1] = recortarConPuntos(ctx, visibles[visibles.length - 1], anchoMaximo);
    return visibles;
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

function recortarConPuntos(ctx, texto, anchoMaximo) {
    let resultado = texto;

    while (resultado.length > 0 && ctx.measureText(`${resultado}...`).width > anchoMaximo) {
        resultado = resultado.slice(0, -1).trim();
    }

    return `${resultado}...`;
}
