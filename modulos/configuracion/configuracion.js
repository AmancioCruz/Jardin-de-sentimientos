import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { guardarPreferenciaLocal, obtenerPreferenciasLocales } from "../../servicios/preferencias_locales.js";

export function crearConfiguracion() {
    const preferencias = obtenerPreferenciasLocales();

    return construirElemento({
        tipo: "section",
        atributos: { class: "configuracion-contenedor" },
        hijos: [
            {
                tipo: "header",
                atributos: { class: "configuracion-encabezado" },
                hijos: [
                    { tipo: "p", atributos: { class: "etiqueta-pantalla etiqueta-pantalla--configuracion" }, hijos: ["Configuración"] },
                    { tipo: "h1", atributos: { class: "titulo-seccion-app" }, hijos: ["Tus ajustes"] }
                ]
            },
            {
                tipo: "section",
                atributos: { class: "configuracion-seccion", "aria-label": "Preferencias" },
                hijos: [
                    {
                        tipo: "div",
                        atributos: { class: "configuracion-seccion__titulo" },
                        hijos: [
                            {
                                tipo: "div",
                                atributos: { class: "configuracion-seccion__titulo-texto" },
                                hijos: [
                                    { tipo: "h2", hijos: ["Preferencias"] }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "configuracion-preferencias" },
                        hijos: [
                            crearSelectorPreferencia({
                                etiqueta: "Sonido durante actividades",
                                id: "preferencia-sonido",
                                valor: preferencias.sonido,
                                opciones: [
                                    { valor: "silencio", texto: "Silencio" },
                                    { valor: "lluvia", texto: "Lluvia" },
                                    { valor: "bosque", texto: "Bosque" },
                                    { valor: "olas", texto: "Olas" }
                                ],
                                alCambiar: (valor) => guardarPreferenciaLocal("sonido", valor)
                            }),
                            crearSelectorPreferencia({
                                etiqueta: "Tema visual",
                                id: "preferencia-tema",
                                valor: preferencias.tema,
                                opciones: [
                                    { valor: "claro", texto: "Claro" },
                                    { valor: "oscuro", texto: "Oscuro" }
                                ],
                                alCambiar: (valor) => guardarPreferenciaLocal("tema", valor)
                            })
                        ]
                    }
                ]
            }
        ]
    });
}

function crearSelectorPreferencia({ etiqueta, id, valor, opciones, alCambiar }) {
    return {
        tipo: "div",
        atributos: { class: "configuracion-preferencia" },
        hijos: [
            {
                tipo: "label",
                atributos: { class: "configuracion-preferencia__etiqueta", for: id },
                hijos: [etiqueta]
            },
            {
                tipo: "select",
                atributos: {
                    class: "select-preferencia configuracion-selector",
                    id
                },
                eventos: {
                    change: (evento) => {
                        if (typeof alCambiar === "function") {
                            alCambiar(evento.target.value);
                        }
                    }
                },
                hijos: opciones.map((opcion) => ({
                    tipo: "option",
                    atributos: {
                        value: opcion.valor,
                        selected: opcion.valor === valor
                    },
                    hijos: [opcion.texto]
                }))
            }
        ]
    };
}
