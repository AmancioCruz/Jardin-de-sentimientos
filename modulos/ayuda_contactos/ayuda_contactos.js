import { construirElemento } from "../../utilidades/constructor_elementos.js";

const directorioCbu = [
    {
        sede: "ICSA",
        edificio: 'Edificio "G"',
        telefonoVisible: "(656) 688-3848 ext. 3955",
        telefonoMarcado: "6566883848",
        extension: "3955",
        icono: "fa-solid fa-user-doctor"
    },
    {
        sede: "ICB",
        edificio: 'Edificio "F"',
        telefonoVisible: "(656) 688-2100 al 09 ext. 1787",
        telefonoMarcado: "6566882100",
        extension: "1787",
        icono: "fa-solid fa-user-doctor"
    },
    {
        sede: "IIT",
        edificio: 'Edificio "C"',
        telefonoVisible: "(656) 688-2100 al 09 ext. 4540",
        telefonoMarcado: "6566882100",
        extension: "4540",
        icono: "fa-solid fa-user-doctor"
    },
    {
        sede: "IADA",
        edificio: 'Edificio "I"',
        telefonoVisible: "(656) 688-2100 al 09 ext. 4693",
        telefonoMarcado: "6566882100",
        extension: "4693",
        icono: "fa-solid fa-user-doctor"
    },
    {
        sede: "Campus Ciudad Universitaria",
        edificio: 'Edificio "A"',
        telefonoVisible: "(656) 688-2100 al 09 ext. 6904",
        telefonoMarcado: "6566882100",
        extension: "6904",
        icono: "fa-solid fa-building-columns"
    },
    {
        sede: "Campus Nuevo Casas Grandes",
        edificio: 'Edificio "B"',
        telefonoVisible: "(636) 692-9800 ext. 79801",
        telefonoMarcado: "6366929800",
        extension: "79801",
        icono: "fa-solid fa-building-columns"
    },
    {
        sede: "Campus Ciudad Cuauhtémoc",
        edificio: 'Edificio "A"',
        telefonoVisible: "(625) 128-1700 ext. 71919",
        telefonoMarcado: "6251281700",
        extension: "71919",
        icono: "fa-solid fa-building-columns"
    }
];

export function crearAyudaContactos() {
    return construirElemento({
        tipo: "section",
        atributos: { class: "ayuda-contactos" },
        hijos: [
            crearEncabezado(),
            {
                tipo: "section",
                atributos: { class: "ayuda-contactos__resumen" },
                hijos: [crearBloqueSedePrincipal()]
            },
            crearBloqueDirectorio(),
            crearNotaSeguridad()
        ]
    });
}

function crearEncabezado() {
    return {
        tipo: "header",
        atributos: { class: "ayuda-contactos__encabezado" },
        hijos: [
            { tipo: "p", atributos: { class: "etiqueta-pantalla etiqueta-pantalla--ayuda" }, hijos: ["Ayuda"] },
            { tipo: "h1", atributos: { class: "titulo-seccion-app" }, hijos: ["Centros de Bienestar Universitario UACJ"] }
        ]
    };
}

function crearBloqueSedePrincipal() {
    return {
        tipo: "section",
        atributos: { class: "ayuda-contactos__tarjeta ayuda-contactos__tarjeta--sede" },
        hijos: [
            crearTituloTarjeta("Sede principal"),
            {
                tipo: "div",
                atributos: { class: "ayuda-contactos__lista-sede" },
                hijos: [
                    crearDatoTexto("Instituto", "ICSA / Instituto de Ciencias Sociales y Administración"),
                    crearDatoTexto("Edificio", 'Edificio "G"'),
                    crearDatoTexto("Dirección", "Av. Heroico Colegio Militar y Av. Universidad (Zona Chamizal)"),
                    crearDatoEnlace("Teléfono general", "(656) 688-3848", "tel:6566883848")
                ]
            }
        ]
    };
}

function crearBloqueDirectorio() {
    const institutos = directorioCbu.filter((sede) => sede.icono.includes("user-doctor"));
    const campus = directorioCbu.filter((sede) => sede.icono.includes("building-columns"));

    return {
        tipo: "section",
        atributos: { class: "ayuda-contactos__tarjeta ayuda-contactos__tarjeta--directorio" },
        hijos: [
            crearTituloSeccion("Directorio por sede", "Encuentra aquí los teléfonos de apoyo según tu instituto o campus."),
            crearGrupoDirectorio("fa-solid fa-building-columns", "Institutos", institutos),
            crearGrupoDirectorio("fa-solid fa-location-dot", "Campus", campus)
        ]
    };
}

function crearGrupoDirectorio(icono, titulo, elementos) {
    return {
        tipo: "section",
        atributos: { class: "ayuda-contactos__grupo-directorio" },
        hijos: [
            {
                tipo: "div",
                atributos: { class: "ayuda-contactos__grupo-directorio-titulo" },
                hijos: [
                    {
                        tipo: "span",
                        atributos: { class: "ayuda-contactos__grupo-directorio-icono" },
                        hijos: [{ tipo: "i", atributos: { class: icono } }]
                    },
                    { tipo: "h3", hijos: [titulo] }
                ]
            },
            {
                tipo: "div",
                atributos: { class: "ayuda-contactos__lista-directorio" },
                hijos: elementos.map(crearFilaSede)
            }
        ]
    };
}

function crearFilaSede(sede) {
    const hrefTelefono = sede.extension
        ? `tel:${sede.telefonoMarcado};ext=${sede.extension}`
        : `tel:${sede.telefonoMarcado}`;

    return {
        tipo: "article",
        atributos: { class: "ayuda-contactos__fila-sede" },
        hijos: [
            {
                tipo: "div",
                atributos: { class: "ayuda-contactos__fila-sede-texto" },
                hijos: [
                    { tipo: "h3", hijos: [sede.sede] },
                    { tipo: "p", hijos: [sede.edificio] }
                ]
            },
            {
                tipo: "div",
                atributos: { class: "ayuda-contactos__fila-sede-telefono" },
                hijos: [
                    {
                        tipo: "span",
                        atributos: { class: "contacto-apoyo__telefono-icono" },
                        hijos: [{ tipo: "i", atributos: { class: "fa-solid fa-phone" } }]
                    },
                    {
                        tipo: "a",
                        atributos: {
                            class: "contacto-apoyo__telefono",
                            href: hrefTelefono
                        },
                        hijos: [sede.telefonoVisible]
                    }
                ]
            }
        ]
    };
}

function crearDatoTexto(etiqueta, valor) {
    return {
        tipo: "article",
        atributos: { class: "ayuda-contactos__dato" },
        hijos: [
            { tipo: "span", atributos: { class: "ayuda-contactos__dato-etiqueta" }, hijos: [etiqueta] },
            { tipo: "strong", atributos: { class: "ayuda-contactos__dato-valor" }, hijos: [valor] }
        ]
    };
}

function crearDatoEnlace(etiqueta, valor, href) {
    return {
        tipo: "article",
        atributos: { class: "ayuda-contactos__dato" },
        hijos: [
            { tipo: "span", atributos: { class: "ayuda-contactos__dato-etiqueta" }, hijos: [etiqueta] },
            {
                tipo: "a",
                atributos: {
                    class: "ayuda-contactos__dato-valor ayuda-contactos__enlace",
                    href
                },
                hijos: [valor]
            }
        ]
    };
}

function crearTituloTarjeta(titulo) {
    return {
        tipo: "h2",
        atributos: { class: "ayuda-contactos__titulo-tarjeta" },
        hijos: [titulo]
    };
}

function crearTituloSeccion(titulo, descripcion) {
    return {
        tipo: "div",
        atributos: { class: "ayuda-contactos__titulo-seccion" },
        hijos: [
            { tipo: "h2", hijos: [titulo] },
            ...(descripcion ? [{ tipo: "p", hijos: [descripcion] }] : [])
        ]
    };
}

function crearNotaSeguridad() {
    return {
        tipo: "p",
        atributos: { class: "ayuda-contactos__nota" },
        hijos: ["Si sientes que puedes hacerte daño o estás en peligro inmediato, busca ayuda urgente con servicios de emergencia de tu zona o con una persona de confianza cercana."]
    };
}
