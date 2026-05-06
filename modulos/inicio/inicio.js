import { construirElemento } from "../../utilidades/constructor_elementos.js";

const actividadesInicio = [
    {
        estado: "No Estoy Seguro",
        titulo: "No sé cómo me siento",
        icono: "fa-solid fa-compass",
        clase: "btn-no-seguro",
        descripcion: "Responde una breve encuesta para orientarte mejor."
    },
    {
        estado: "Saturado Mentalmente",
        titulo: "Tengo la mente saturada",
        icono: "fa-solid fa-brain",
        clase: "btn-jardin",
        descripcion: "Plasma lo que tienes en mente en tres notas."
    },
    {
        estado: "Pizarrón Creativo",
        titulo: "No me puedo concentrar",
        icono: "fa-solid fa-palette",
        clase: "btn-pizarron",
        descripcion: "Expresa tus pensamientos en una pizarra visual."
    },
    {
        estado: "Cansado",
        titulo: "Necesito una pausa",
        icono: "fa-solid fa-wind",
        clase: "btn-respiraciones",
        descripcion: "Sigue una pausa guiada para recuperar el ritmo."
    },
    {
        estado: "Ansioso",
        titulo: "Me siento bajo presión",
        icono: "fa-solid fa-shield-halved",
        clase: "btn-ansioso",
        descripcion: "Aleja estresores y protege tu flor por un momento."
    },
    {
        estado: "Recursos",
        titulo: "¿Qué más puedo hacer?",
        clase: "btn-recursos",
        descripcion: "Explora opciones breves para acompañarte ahora."
    }
];

export function crearInicio({ callbacks, usuario }) {
    const { alSeleccionarEstado, alNoEstoySeguro, alAbrirRecursos } = callbacks || {};
    const nombreUsuario = usuario?.nombre || "Tu espacio";
    const primerNombre = nombreUsuario.split(" ")[0] || nombreUsuario;

    return construirElemento({
        tipo: "div",
        atributos: {
            id: "contenedor-inicio",
            class: "inicio-contenedor"
        },
        hijos: [
            {
                tipo: "section",
                atributos: { class: "inicio-eleccion" },
                hijos: [
                    {
                        tipo: "section",
                        atributos: { class: "inicio-hero" },
                        hijos: [
                            {
                                tipo: "div",
                                atributos: { class: "inicio-copy" },
                                hijos: [
                                    {
                                        tipo: "div",
                                        atributos: { class: "inicio-encabezado" },
                                        hijos: [
                                            {
                                                tipo: "h2",
                                                atributos: { class: "inicio-titulo" },
                                                hijos: ["¿Cómo te sientes hoy?"]
                                            },
                                            {
                                                tipo: "p",
                                                atributos: { class: "inicio-descripcion" },
                                                hijos: ["Elige la opción que más se acerque a lo que estás sintiendo en este momento."]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tipo: "div",
                                atributos: { class: "inicio-hero-lateral" },
                                hijos: [
                                    {
                                        tipo: "div",
                                        atributos: { class: "inicio-recordatorio" },
                                        hijos: [
                                            {
                                                tipo: "i",
                                                atributos: { class: "fa-solid fa-heart", "aria-hidden": "true" }
                                            },
                                            {
                                                tipo: "span",
                                                hijos: [`${primerNombre}, haz una pausa para ti.`]
                                            },
                                            {
                                                tipo: "i",
                                                atributos: {
                                                    class: "fa-solid fa-heart inicio-recordatorio__corazon",
                                                    "aria-hidden": "true"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tipo: "img",
                                        atributos: {
                                            class: "inicio-ilustracion",
                                            src: "./recursos/imagenes/spa.svg",
                                            alt: "Ilustración de un brote en crecimiento"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "evaluacion-rapida" },
                        hijos: crearBotonesActividades(actividadesInicio, {
                            alSeleccionarEstado,
                            alNoEstoySeguro,
                            alAbrirRecursos
                        }, usuario)
                    }
                ]
            }
        ]
    });
}

function crearBotonesActividades(actividades, callbacks, usuario) {
    const { alSeleccionarEstado, alNoEstoySeguro, alAbrirRecursos } = callbacks || {};

    return actividades.map((actividad) => ({
        tipo: "button",
        atributos: {
            class: `btn-estado ${actividad.clase}`,
            "data-estado": actividad.estado
        },
        eventos: {
            click: () => {
                if (actividad.estado === "No Estoy Seguro") {
                    if (alNoEstoySeguro) alNoEstoySeguro(usuario);
                    return;
                }

                if (actividad.estado === "Recursos") {
                    if (alAbrirRecursos) alAbrirRecursos(usuario);
                    return;
                }

                if (alSeleccionarEstado) alSeleccionarEstado(actividad.estado, usuario);
            }
        },
        hijos: [
            ...(actividad.icono ? [{
                tipo: "i",
                atributos: { class: `${actividad.icono} estado-icono`, "aria-hidden": "true" }
            }] : []),
            {
                tipo: "span",
                atributos: { class: "estado-contenido" },
                hijos: [
                    {
                        tipo: "span",
                        atributos: { class: "estado-texto" },
                        hijos: [actividad.titulo]
                    },
                    {
                        tipo: "span",
                        atributos: { class: "estado-descripcion" },
                        hijos: [actividad.descripcion]
                    }
                ]
            },
            {
                tipo: "span",
                atributos: { class: "estado-flecha", "aria-hidden": "true" },
                hijos: [
                    {
                        tipo: "i",
                        atributos: { class: "fa-solid fa-chevron-right" }
                    }
                ]
            }
        ]
    }));
}
