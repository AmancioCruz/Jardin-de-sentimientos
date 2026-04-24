import { construirElemento } from "../../utilidades/constructor_elementos.js";

const recursosRapidos = [
    {
        titulo: "Ver, tocar y escuchar",
        icono: "fa-solid fa-hand-sparkles",
        descripcion: "Sirve para bajar un poco la intensidad cuando la mente va muy rápido o se siente dispersa.",
        duracion: "1 a 3 minutos",
        pasos: [
            "Mira 3 cosas a tu alrededor y nómbralas despacio.",
            "Toca 3 superficies distintas y nota su temperatura o textura.",
            "Escucha 3 sonidos, aunque sean pequeños.",
            "Haz una respiración lenta antes de seguir con lo siguiente."
        ],
        fundamento: "Estas técnicas de grounding ayudan a llevar la atención al presente y suelen usarse para reducir activación y desorientación."
    },
    {
        titulo: "Tres cosas que agradezco",
        icono: "fa-solid fa-book-open",
        descripcion: "No busca negar lo difícil. Ayuda a notar algo bueno o valioso que también estuvo presente hoy.",
        duracion: "2 a 5 minutos",
        pasos: [
            "Escribe una cosa pequeña que agradeces hoy.",
            "Anota algo que alguien hizo por ti o algo que tú hiciste por ti.",
            "Cierra con una frase corta: hoy también pude notar..."
        ],
        fundamento: "Prácticas breves de gratitud pueden ayudar a ampliar el foco de atención y equilibrar la tendencia a quedarnos solo con lo pesado."
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
        fundamento: "El movimiento suave puede apoyar la regulación del estrés porque ayuda a descargar tensión física y a cambiar de ritmo."
    }
];

export function crearRecursosApoyo() {
    return construirElemento({
        tipo: "section",
        atributos: { class: "recursos-apoyo" },
        hijos: [
            crearEncabezado(),
            crearSeccionGuias()
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
                hijos: ["Estas opciones son breves, claras y suelen ayudar a regularse un poco mejor en momentos de tensión, saturación o inquietud."]
            },
            {
                tipo: "p",
                atributos: { class: "recursos-apoyo__practica" },
                hijos: ["No tienes que usarlas perfecto. Funcionan mejor cuando se practican varias veces, porque así es más fácil recordarlas cuando las necesites."]
            }
        ]
    };
}

function crearSeccionGuias() {
    return {
        tipo: "section",
        atributos: { class: "recursos-apoyo__bloque" },
        hijos: [
            crearTituloSeccion("Tres herramientas concretas", "Elige solo una. Lo importante es probar algo pequeño y posible en este momento."),
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
                    { tipo: "h2", hijos: [recurso.titulo] }
                ]
            },
            { tipo: "p", hijos: [recurso.descripcion] },
            {
                tipo: "p",
                atributos: { class: "recurso-tarjeta__meta" },
                hijos: [`Tiempo sugerido: ${recurso.duracion}`]
            },
            {
                tipo: "ol",
                hijos: recurso.pasos.map((paso) => ({
                    tipo: "li",
                    hijos: [paso]
                }))
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
