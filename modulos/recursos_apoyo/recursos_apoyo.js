import { construirElemento } from "../../utilidades/constructor_elementos.js";

const recursosRapidos = [
    {
        titulo: "Ver, tocar y escuchar",
        icono: "fa-solid fa-hand-sparkles",
        descripcion: "Ayuda a volver al presente cuando la mente va muy rápido o se siente dispersa.",
        duracion: "1 a 3 minutos",
        pasos: [
            "Mira 3 cosas a tu alrededor y nómbralas despacio.",
            "Toca 3 superficies distintas y nota su temperatura o textura.",
            "Escucha 3 sonidos, aunque sean pequeños.",
            "Haz una respiración lenta antes de seguir con lo siguiente."
        ],
        fundamento: "Este tipo de grounding ayuda a traer la atención al presente cuando todo se siente demasiado rápido."
    },
    {
        titulo: "Tres cosas que agradezco",
        icono: "fa-solid fa-book-open",
        descripcion: "Ayuda a notar algo valioso del día sin negar lo difícil que también estuvo presente.",
        duracion: "2 a 5 minutos",
        pasos: [
            "Escribe una cosa pequeña que agradeces hoy.",
            "Anota algo que alguien hizo por ti o algo que tú hiciste por ti.",
            "Cierra con una frase corta: hoy también pude notar..."
        ],
        fundamento: "Una pausa breve de gratitud puede ayudarte a ampliar el foco y no quedarte solo con lo pesado."
    },
    {
        titulo: "Mover el cuerpo un poco",
        icono: "fa-solid fa-person-walking",
        descripcion: "Puede ayudar cuando sientes acumulación de tensión, inquietud o cansancio mental.",
        duracion: "2 a 5 minutos",
        pasos: [
            "Ponte de pie y estira cuello, hombros y espalda.",
            "Camina un poco, aunque sea dentro del mismo espacio.",
            "Mueve brazos y piernas con suavidad.",
            "Toma agua y nota si tu cuerpo se siente un poco más suelto."
        ],
        fundamento: "El movimiento suave puede ayudar a soltar tensión física y a cambiar un poco el ritmo interno."
    }
];

export function crearRecursosApoyo({ alSalir } = {}) {
    return construirElemento({
        tipo: "section",
        atributos: { class: "recursos-apoyo" },
        hijos: [
            crearEncabezado(),
            crearSeccionGuias(),
            crearAccionesRecursos(alSalir)
        ]
    });
}

function crearEncabezado() {
    return {
        tipo: "header",
        atributos: { class: "recursos-apoyo__encabezado" },
        hijos: [
            { tipo: "p", atributos: { class: "etiqueta-pantalla etiqueta-pantalla--apoyo" }, hijos: ["Más herramientas"] },
            { tipo: "h1", atributos: { class: "titulo-seccion-app" }, hijos: ["Qué más puedo hacer ahora"] },
            {
                tipo: "p",
                hijos: [
                    "Son opciones breves para acompañarte mejor cuando aparece tensión, saturación o inquietud, ",
                    {
                        tipo: "span",
                        atributos: { class: "recursos-apoyo__frase-resaltada" },
                        hijos: ["no tienes que hacerlas perfecto"]
                    },
                    ". Lo importante es probar una y ver si te ayuda en este momento."
                ]
            },
            {
                tipo: "p",
                atributos: { class: "recursos-apoyo__acompanamiento" },
                hijos: ["Estas actividades pueden acompañarte en algunos momentos, pero no siempre funcionan igual para todas las personas. Si sientes que el malestar sigue presente o va aumentando, tal vez te haga bien acercarte también a otros apoyos que estén disponibles para ti."]
            }
        ]
    };
}

function crearSeccionGuias() {
    return {
        tipo: "section",
        atributos: { class: "recursos-apoyo__bloque" },
        hijos: [
            crearTituloSeccion("Tres herramientas concretas", "Elige solo una. La idea es empezar por algo pequeño y posible ahora."),
            {
                tipo: "div",
                atributos: { class: "recursos-apoyo__tarjetas" },
                hijos: recursosRapidos.map(crearTarjetaRecurso)
            }
        ]
    };
}

function crearTarjetaRecurso(recurso) {
    return {
        tipo: "article",
        atributos: { class: "recurso-tarjeta" },
        hijos: [
            {
                tipo: "div",
                atributos: { class: "recurso-tarjeta__titulo" },
                hijos: [
                    { tipo: "i", atributos: { class: recurso.icono } },
                    { tipo: "h3", hijos: [recurso.titulo] }
                ]
            },
            { tipo: "p", hijos: [recurso.descripcion] },
            {
                tipo: "div",
                atributos: { class: "recurso-tarjeta__guia" },
                hijos: [
                    {
                        tipo: "p",
                        atributos: { class: "recurso-tarjeta__guia-titulo" },
                        hijos: ["Puedes probar esto ahora:"]
                    },
                    {
                        tipo: "ol",
                        hijos: recurso.pasos.map((paso) => ({
                            tipo: "li",
                            hijos: [paso]
                        }))
                    }
                ]
            },
            {
                tipo: "p",
                atributos: { class: "recurso-tarjeta__meta" },
                hijos: [`Tiempo sugerido: ${recurso.duracion}`]
            },
            {
                tipo: "p",
                atributos: { class: "recurso-tarjeta__fundamento" },
                hijos: [recurso.fundamento]
            }
        ]
    };
}

function crearTituloSeccion(titulo, descripcion) {
    return {
        tipo: "div",
        atributos: { class: "recursos-apoyo__titulo-seccion" },
        hijos: [
            { tipo: "h2", hijos: [titulo] },
            { tipo: "p", hijos: [descripcion] }
        ]
    };
}

function crearAccionesRecursos(alSalir) {
    return {
        tipo: "div",
        atributos: { class: "recursos-apoyo__acciones" },
        hijos: [
            {
                tipo: "button",
                atributos: {
                    type: "button",
                    class: "btn-actividad-salir recursos-apoyo__salir"
                },
                eventos: {
                    click: () => {
                        if (typeof alSalir === "function") {
                            alSalir();
                        }
                    }
                },
                hijos: ["Salir"]
            }
        ]
    };
}
