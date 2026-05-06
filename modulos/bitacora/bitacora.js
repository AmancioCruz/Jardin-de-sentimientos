import { obtenerActividadesUsuario } from "../../servicios/base_datos.js";
import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { activarOverlay, desactivarOverlay } from "../../servicios/overlay.js";

const LIMITE_INICIAL = 5;

export function mostrarBitacora({ usuario, mostrarEncabezado = true } = {}) {
    const hijos = [];

    if (mostrarEncabezado) {
        hijos.push({
            tipo: "header",
            atributos: { class: "bitacora-encabezado" },
            hijos: [
                { tipo: "p", atributos: { class: "etiqueta-pantalla etiqueta-pantalla--bitacora" }, hijos: ["Bitácora"] },
                { tipo: "h1", atributos: { class: "titulo-seccion-app" }, hijos: ["Lo que has guardado"] },
                { tipo: "p", hijos: ["Aquí puedes volver a momentos que decidiste guardar y revisar tu recorrido dentro de la app."] }
            ]
        });
    }

    hijos.push({
        tipo: "section",
        atributos: { class: "bitacora-recorrido" },
        hijos: [
            {
                tipo: "header",
                atributos: { class: "bitacora-recorrido__encabezado" },
                hijos: [
                    { tipo: "h2", hijos: ["Tu recorrido"] }
                ]
            },
            {
                tipo: "section",
                atributos: { class: "bitacora-resumen", "data-bitacora-resumen": "" },
                hijos: [
                    {
                        tipo: "p",
                        atributos: { class: "bitacora-estado bitacora-estado--ligero" },
                        hijos: ["Estamos reuniendo tu recorrido..."]
                    }
                ]
            },
            {
                tipo: "div",
                atributos: { class: "bitacora-filtros", "data-bitacora-filtros": "" }
            },
            {
                tipo: "div",
                atributos: { class: "bitacora-listado", "data-bitacora-listado": "" },
                hijos: [
                    { tipo: "p", atributos: { class: "bitacora-estado" }, hijos: ["Estamos reuniendo tu recorrido..."] }
                ]
            },
            {
                tipo: "div",
                atributos: { class: "bitacora-acciones" },
                hijos: [
                    {
                        tipo: "button",
                        atributos: {
                            type: "button",
                            class: "btn-fantasma bitacora-ver-mas",
                            hidden: true,
                            "data-bitacora-ver-mas": ""
                        },
                        hijos: ["Ver más"]
                    }
                ]
            }
        ]
    });

    const vista = construirElemento({
        tipo: "section",
        atributos: {
            id: "contenedor-bitacora",
            class: "bitacora-contenedor"
        },
        hijos
    });

    setTimeout(() => cargarBitacora(vista.nodo, usuario), 0);

    return vista;
}

async function cargarBitacora(nodo, usuario) {
    const resumen = nodo?.querySelector("[data-bitacora-resumen]");
    const filtros = nodo?.querySelector("[data-bitacora-filtros]");
    const listado = nodo?.querySelector("[data-bitacora-listado]");
    const botonVerMas = nodo?.querySelector("[data-bitacora-ver-mas]");

    if (!resumen || !filtros || !listado || !botonVerMas) return;

    if (!usuario?.uid) {
        mostrarEstadoBitacora(listado, "Inicia sesión para volver a lo que has guardado.");
        resumen.innerHTML = "";
        filtros.innerHTML = "";
        botonVerMas.hidden = true;
        return;
    }

    const actividades = await obtenerActividadesUsuario(usuario.uid);

    if (!actividades.length) {
        renderizarResumen(resumen, actividades);
        filtros.innerHTML = "";
        mostrarEstadoBitacora(listado, "Aquí irán apareciendo los momentos que decidas guardar en la app.");
        botonVerMas.hidden = true;
        return;
    }

    const estado = {
        actividades,
        filtro: "todo",
        limite: LIMITE_INICIAL,
        resumen,
        filtros,
        listado,
        botonVerMas
    };

    botonVerMas.addEventListener("click", () => {
        estado.limite += LIMITE_INICIAL;
        renderizarBitacora(estado);
    });

    renderizarBitacora(estado);
}

function renderizarBitacora(estado) {
    const { actividades, resumen, filtros, listado, botonVerMas, filtro, limite } = estado;
    const actividadesFiltradas = aplicarFiltro(actividades, filtro);
    const actividadesVisibles = actividadesFiltradas.slice(0, limite);

    renderizarResumen(resumen, actividades);
    renderizarFiltros(filtros, filtro, (nuevoFiltro) => {
        estado.filtro = nuevoFiltro;
        estado.limite = LIMITE_INICIAL;
        renderizarBitacora(estado);
    });
    renderizarListado(listado, actividadesVisibles, filtro);

    botonVerMas.hidden = actividadesFiltradas.length <= limite;
}

function renderizarResumen(contenedor, actividades) {
    contenedor.replaceChildren();

    if (!actividades.length) {
        const estado = document.createElement("p");
        estado.className = "bitacora-estado bitacora-estado--ligero";
        estado.textContent = "Tu recorrido empezará a verse aquí cuando guardes tu primera actividad.";
        contenedor.appendChild(estado);
        return;
    }

    const estaSemana = actividades.filter((actividad) => esDeEstaSemana(actividad)).length;
    const ultimaActividad = actividades[0];
    const tarjetas = document.createElement("div");
    tarjetas.className = "bitacora-resumen__tarjetas";

    [
        {
            valor: `${actividades.length}`,
            detalle: "Momentos guardados",
            icono: "fa-regular fa-bookmark",
            clase: "bitacora-resumen__icono--general"
        },
        {
            valor: `${estaSemana}`,
            detalle: "Esta semana",
            icono: "fa-regular fa-calendar-days",
            clase: "bitacora-resumen__icono--semana"
        },
        {
            valor: formatearMomentoResumen(ultimaActividad),
            detalle: "Última actividad",
            icono: obtenerIconoActividad(ultimaActividad?.nombreActividad),
            clase: obtenerClaseIconoActividad(ultimaActividad?.nombreActividad)
        }
    ].forEach(({ valor, detalle, icono, clase }) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "bitacora-resumen__tarjeta";

        const iconoNodo = document.createElement("span");
        iconoNodo.className = `bitacora-resumen__icono ${clase}`;
        iconoNodo.appendChild(crearIcono(icono));

        const contenido = document.createElement("div");
        contenido.className = "bitacora-resumen__contenido";

        const valorNodo = document.createElement("strong");
        valorNodo.className = "bitacora-resumen__valor";
        valorNodo.textContent = valor;

        const detalleNodo = document.createElement("span");
        detalleNodo.className = "bitacora-resumen__detalle";
        detalleNodo.textContent = detalle;

        contenido.append(valorNodo, detalleNodo);
        tarjeta.append(iconoNodo, contenido);
        tarjetas.appendChild(tarjeta);
    });

    contenedor.append(tarjetas);
}

function renderizarFiltros(contenedor, filtroActivo, alCambiar) {
    contenedor.replaceChildren();

    const opciones = [
        { id: "todo", etiqueta: "Todo" },
        { id: "semana", etiqueta: "Esta semana" },
        { id: "recomendadas", etiqueta: "Recomendadas", icono: obtenerIconoActividad("no-seguro"), clase: obtenerClaseIconoActividad("no-seguro") },
        { id: "tablero", etiqueta: "Tablero", icono: obtenerIconoActividad("tablero"), clase: obtenerClaseIconoActividad("tablero") },
        { id: "respiracion", etiqueta: "Respiración", icono: obtenerIconoActividad("respiracion"), clase: obtenerClaseIconoActividad("respiracion") },
        { id: "pizarron", etiqueta: "Pizarrón", icono: obtenerIconoActividad("pizarron"), clase: obtenerClaseIconoActividad("pizarron") },
        { id: "juego", etiqueta: "Protege tu flor", icono: obtenerIconoActividad("juego"), clase: obtenerClaseIconoActividad("juego") }
    ];

    opciones.forEach(({ id, etiqueta, icono, clase }) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "bitacora-filtro";
        boton.dataset.filtro = id;
        boton.setAttribute("aria-pressed", String(filtroActivo === id));
        boton.setAttribute("aria-label", etiqueta);
        boton.title = etiqueta;

        if (icono) {
            boton.classList.add("bitacora-filtro--icono");
            if (id === "recomendadas") {
                boton.classList.add("bitacora-filtro--recomendadas");
            }

            const iconoNodo = document.createElement("span");
            iconoNodo.className = `bitacora-filtro__icono ${clase}`;
            iconoNodo.appendChild(crearIcono(icono));
            boton.appendChild(iconoNodo);
        } else {
            boton.classList.add("bitacora-filtro--texto");
            boton.textContent = etiqueta;
        }

        if (filtroActivo === id) {
            boton.classList.add("activo");
        }

        boton.addEventListener("click", () => alCambiar(id));
        contenedor.appendChild(boton);
    });
}

function renderizarListado(contenedor, actividades, filtroActivo) {
    contenedor.replaceChildren();

    if (!actividades.length) {
        const mensaje = filtroActivo === "semana"
            ? "Esta semana aún no has guardado momentos."
            : "No encontramos momentos para ese filtro.";
        mostrarEstadoBitacora(contenedor, mensaje);
        return;
    }

    const grupos = crearGruposVisibles(actividades, filtroActivo);

    grupos.forEach(({ titulo, actividades: actividadesGrupo }) => {
        if (!actividadesGrupo.length) return;

        const seccion = document.createElement("section");
        seccion.className = "bitacora-bloque";

        const encabezado = document.createElement("header");
        encabezado.className = "bitacora-bloque__encabezado";

        const nombre = document.createElement("h3");
        nombre.textContent = titulo;

        const contador = document.createElement("span");
        contador.textContent = `${actividadesGrupo.length} momento${actividadesGrupo.length === 1 ? "" : "s"}`;

        const lista = document.createElement("div");
        lista.className = "bitacora-lista-momentos";

        actividadesGrupo.forEach((actividad) => {
            lista.appendChild(crearTarjetaActividad(actividad));
        });

        encabezado.append(nombre, contador);
        seccion.append(encabezado, lista);
        contenedor.appendChild(seccion);
    });
}

function crearGruposVisibles(actividades, filtroActivo) {
    if (filtroActivo === "todo") {
        return [{ titulo: "Tus últimos momentos", actividades }];
    }

    if (filtroActivo === "semana") {
        return [{ titulo: "Tus momentos de esta semana", actividades }];
    }

    if (filtroActivo === "recomendadas") {
        return [{ titulo: "Tus actividades recomendadas", actividades }];
    }

    return [{
        titulo: `Tus momentos en ${formatearNombreActividad(filtroActivo)}`,
        actividades
    }];
}

function mostrarEstadoBitacora(contenedor, mensaje) {
    const estado = document.createElement("p");
    estado.className = "bitacora-estado";
    estado.textContent = mensaje;
    contenedor.replaceChildren(estado);
}

function crearTarjetaActividad(actividad) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "bitacora-momento";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "bitacora-momento__boton";
    boton.setAttribute("aria-label", `Abrir actividad ${formatearNombreActividad(actividad.nombreActividad)}`);

    const vista = document.createElement("div");
    vista.className = "bitacora-momento__vista";
    const iconoActividad = document.createElement("span");
    iconoActividad.className = `bitacora-momento__icono ${obtenerClaseIconoActividad(actividad.nombreActividad)}`;
    iconoActividad.appendChild(crearIcono(obtenerIconoActividad(actividad.nombreActividad)));
    vista.appendChild(iconoActividad);

    const contenido = document.createElement("div");
    contenido.className = "bitacora-momento__contenido";

    const titulo = document.createElement("strong");
    titulo.className = "bitacora-momento__titulo";
    titulo.textContent = formatearNombreActividad(actividad.nombreActividad);

    const meta = document.createElement("p");
    meta.className = "bitacora-momento__meta";
    meta.textContent = formatearMomentoHumano(actividad);

    const extracto = document.createElement("p");
    extracto.className = "bitacora-momento__estado";
    extracto.textContent = obtenerResumenActividadLista(actividad);

    const flecha = document.createElement("span");
    flecha.className = "bitacora-momento__flecha";
    flecha.appendChild(crearIcono("fa-solid fa-chevron-right"));

    contenido.append(titulo, meta, extracto);
    boton.append(vista, contenido, flecha);
    tarjeta.appendChild(boton);

    boton.addEventListener("click", () => abrirDetalleActividad(actividad));

    return tarjeta;
}

function aplicarFiltro(actividades, filtro) {
    if (filtro === "todo") return actividades;
    if (filtro === "semana") return actividades.filter((actividad) => esDeEstaSemana(actividad));
    if (filtro === "recomendadas") return actividades.filter(esActividadRecomendada);

    return actividades.filter((actividad) => actividad.nombreActividad === filtro);
}

function esDeEstaSemana(actividad) {
    const fecha = obtenerFechaActividad(actividad);
    if (!fecha) return false;

    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7));

    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 7);

    return fecha >= inicio && fecha < fin;
}

function obtenerFechaActividad(actividad) {
    if (actividad?.fecha) {
        const [anio, mes, dia] = actividad.fecha.split("-").map(Number);
        return new Date(anio, (mes || 1) - 1, dia || 1);
    }

    if (actividad?.creadoEn) {
        return new Date(actividad.creadoEn);
    }

    return null;
}

function formatearMomentoResumen(actividad) {
    const fecha = obtenerFechaActividad(actividad);
    if (!fecha) return "Sin registro";

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const fechaSinHora = new Date(fecha);
    fechaSinHora.setHours(0, 0, 0, 0);

    let etiquetaFecha = new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "short"
    }).format(fecha);

    if (fechaSinHora.getTime() === hoy.getTime()) {
        etiquetaFecha = "Hoy";
    } else if (fechaSinHora.getTime() === ayer.getTime()) {
        etiquetaFecha = "Ayer";
    }

    return etiquetaFecha;
}

function formatearHoraCorta(hora = "") {
    if (!hora) return "";

    const [horasTexto = "0", minutosTexto = "0"] = hora.split(":");
    const horas = Number(horasTexto);
    const minutos = Number(minutosTexto);

    if (Number.isNaN(horas) || Number.isNaN(minutos)) return hora;

    const periodo = horas >= 12 ? "PM" : "AM";
    const horas12 = ((horas + 11) % 12) + 1;
    return `${horas12}:${String(minutos).padStart(2, "0")} ${periodo}`;
}

function formatearMomentoHumano(actividad) {
    const fecha = obtenerFechaActividad(actividad);
    const hora = formatearHoraCorta(actividad?.hora?.trim());

    if (!fecha) return hora || "Sin fecha";

    const etiquetaFecha = new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).format(fecha);

    const fechaCapitalizada = etiquetaFecha.charAt(0).toUpperCase() + etiquetaFecha.slice(1);
    if (esVistaMovilBitacora()) {
        return fechaCapitalizada;
    }

    return hora ? `${fechaCapitalizada} - ${hora}` : fechaCapitalizada;
}

function esVistaMovilBitacora() {
    return typeof window !== "undefined"
        && typeof window.matchMedia === "function"
        && window.matchMedia("(max-width: 767px)").matches;
}

function obtenerResumenActividadLista(actividad) {
    const resumenContexto = limpiarTextoActividad(actividad?.contexto?.resumen || "");
    if (resumenContexto) return resumenContexto;

    const actividadNombre = formatearNombreActividad(actividad?.nombreActividad);
    const clave = obtenerClaveActividad(actividadNombre);
    if (esActividadRecomendada(actividad)) {
        return `La evaluación te recomendó ${actividadNombre} para acompañar este momento.`;
    }
    const resumenes = {
        tablero: "Usaste Tablero de ideas para ordenar lo que pensabas y sentías.",
        juego: "Usaste Protege tu flor para protegerte de lo que te estaba presionando.",
        respiracion: "Usaste Respiración guiada porque necesitabas una pausa.",
        pizarron: "Usaste Pizarrón creativo para aclarar tus ideas de forma visual.",
        "no-seguro": "Usaste esta actividad para encontrar algo que te ayudará mejor en ese momento."
    };

    return resumenes[clave] || `Usaste ${actividadNombre} para acompañar este momento.`;
}

function limpiarTextoActividad(texto = "") {
    return texto.replace(/\s+/g, " ").trim();
}

function abrirDetalleActividad(actividad) {
    cerrarDetalleActividad();

    const modal = document.createElement("div");
    modal.className = "bitacora-detalle";
    modal.id = "bitacora-detalle";

    const tarjeta = document.createElement("div");
    tarjeta.className = "bitacora-detalle__tarjeta";
    tarjeta.setAttribute("role", "dialog");
    tarjeta.setAttribute("aria-modal", "true");
    tarjeta.setAttribute("aria-labelledby", "bitacora-detalle-titulo");

    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.className = "bitacora-detalle__cerrar";
    cerrar.setAttribute("aria-label", "Cerrar");
    cerrar.appendChild(crearIcono("fa-solid fa-xmark"));

    const titulo = document.createElement("h2");
    titulo.className = "bitacora-detalle__titulo";
    titulo.id = "bitacora-detalle-titulo";
    titulo.textContent = formatearNombreActividad(actividad?.nombreActividad);

    const medio = crearMedioDetalle(actividad);
    const info = crearInfoDetalle(actividad);
    tarjeta.append(cerrar, titulo, medio, info);
    modal.appendChild(tarjeta);

    cerrar.addEventListener("click", cerrarDetalleActividad);
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) cerrarDetalleActividad();
    });
    document.body.appendChild(modal);
    activarOverlay("bitacora-detalle");
}

function crearMedioDetalle(actividad) {
    if (!actividad.imagenUrl) {
        const sinImagen = document.createElement("div");
        sinImagen.className = "bitacora-detalle__sin-imagen";
        sinImagen.textContent = "Esta actividad no tiene una imagen guardada";
        return sinImagen;
    }

    const imagen = document.createElement("img");
    imagen.src = actividad.imagenUrl;
    imagen.alt = `Actividad ${formatearNombreActividad(actividad.nombreActividad)}`;
    return imagen;
}

function crearInfoDetalle(actividad) {
    const info = document.createElement("div");
    info.className = "bitacora-detalle__info";

    const meta = document.createElement("p");
    meta.textContent = formatearMomentoHumano(actividad);

    const resumen = document.createElement("p");
    resumen.textContent = obtenerResumenDetalleActividad(actividad);

    info.append(meta, resumen);

    if (esActividadRecomendada(actividad)) {
        const bloqueRespuestas = crearBloqueDetalle(
            "Qué respondiste",
            obtenerResumenRespuestasEvaluacion(actividad)
        );
        const bloqueRecomendacion = crearBloqueDetalle(
            "Qué se te recomendó",
            [formatearActividadSugerida(actividad)]
        );
        info.append(bloqueRespuestas, bloqueRecomendacion);
    }

    const bloqueResultado = crearBloqueDetalle(
        "Cómo terminaste",
        obtenerResultadoActividad(actividad)
    );

    info.append(bloqueResultado);
    return info;
}

function crearBloqueDetalle(titulo, lineas = []) {
    const bloque = document.createElement("section");
    bloque.className = "bitacora-detalle__bloque";

    const encabezado = document.createElement("strong");
    encabezado.textContent = titulo;
    bloque.appendChild(encabezado);

    lineas.filter(Boolean).forEach((linea) => {
        const texto = document.createElement("p");
        texto.textContent = linea;
        bloque.appendChild(texto);
    });

    return bloque;
}

function obtenerResumenRespuestasEvaluacion(actividad) {
    const preguntas = actividad?.contexto?.evaluacion?.preguntas;
    if (!Array.isArray(preguntas) || !preguntas.length) {
        return ["No encontramos el detalle de tus respuestas."];
    }

    const respuestasOrdenadas = [...preguntas]
        .filter((pregunta) => Number(pregunta?.respuesta) > 0)
        .sort((a, b) => Number(b?.respuesta || 0) - Number(a?.respuesta || 0));

    if (!respuestasOrdenadas.length) {
        return ["No encontramos el detalle de tus respuestas."];
    }

    return respuestasOrdenadas.slice(0, 3).map((pregunta) => {
        return `${pregunta.texto} (${pregunta.respuesta}/5)`;
    });
}

function formatearActividadSugerida(actividad) {
    const actividadSugerida = actividad?.contexto?.evaluacion?.actividadSugerida || actividad?.nombreActividad;
    return formatearNombreActividad(actividadSugerida);
}

function obtenerResultadoActividad(actividad) {
    const resultado = [];

    if (actividad?.respuesta?.trim()) {
        resultado.push(actividad.respuesta.trim());
    }

    if (actividad?.comentario?.trim()) {
        resultado.push(`También escribiste: "${actividad.comentario.trim()}".`);
    }

    return resultado.length ? resultado : ["Guardaste la actividad sin agregar un cierre escrito."];
}

function obtenerResumenDetalleActividad(actividad) {
    const resumenContexto = limpiarTextoActividad(actividad?.contexto?.resumen || "");
    if (resumenContexto) return resumenContexto;

    const actividadNombre = formatearNombreActividad(actividad?.nombreActividad);
    const resumenes = {
        tablero: `Usaste ${actividadNombre} para ordenar lo que pensabas y sentías.`,
        juego: `Usaste ${actividadNombre} para protegerte de lo que te estaba presionando.`,
        respiracion: `Usaste ${actividadNombre} porque necesitabas una pausa.`,
        pizarron: `Usaste ${actividadNombre} para aclarar tus ideas de forma visual.`,
        "no-seguro": `Usaste ${actividadNombre} para encontrar algo que te ayudaría mejor en ese momento.`
    };

    return resumenes[obtenerClaveActividad(actividadNombre)] || `Usaste ${actividadNombre} para acompañar este momento.`;
}

function esActividadRecomendada(actividad) {
    return actividad?.contexto?.origen === "evaluacion";
}

function crearIcono(clase) {
    const icono = document.createElement("i");
    icono.className = clase;
    return icono;
}

function cerrarDetalleActividad() {
    document.getElementById("bitacora-detalle")?.remove();
    desactivarOverlay("bitacora-detalle");
}

function formatearNombreActividad(nombre = "") {
    const nombres = {
        tablero: "Tablero de ideas",
        juego: "Protege tu flor",
        respiracion: "Respiración guiada",
        pizarron: "Pizarrón creativo"
    };

    return nombres[nombre] || nombre || "Actividad";
}

function obtenerClaveActividad(nombre = "") {
    const claves = {
        "Tablero de ideas": "tablero",
        "Protege tu flor": "juego",
        "Respiración guiada": "respiracion",
        "Pizarrón creativo": "pizarron",
        "No sé cómo me siento": "no-seguro"
    };

    return claves[nombre] || nombre || "";
}

function obtenerIconoActividad(nombre = "") {
    const clave = obtenerClaveActividad(formatearNombreActividad(nombre));
    const iconos = {
        tablero: "fa-solid fa-note-sticky",
        juego: "fa-solid fa-shield-halved",
        respiracion: "fa-solid fa-wind",
        pizarron: "fa-solid fa-palette",
        "no-seguro": "fa-solid fa-compass"
    };

    return iconos[clave] || "fa-solid fa-heart";
}

function obtenerClaseIconoActividad(nombre = "") {
    const clave = obtenerClaveActividad(formatearNombreActividad(nombre));
    const clases = {
        tablero: "bitacora-resumen__icono--tablero",
        juego: "bitacora-resumen__icono--juego",
        respiracion: "bitacora-resumen__icono--respiracion",
        pizarron: "bitacora-resumen__icono--pizarron",
        "no-seguro": "bitacora-resumen__icono--no-seguro"
    };

    return clases[clave] || "bitacora-resumen__icono--general";
}
