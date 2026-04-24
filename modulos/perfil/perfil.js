import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function crearPerfil({ usuario }) {
    return construirElemento({
        tipo: "section",
        atributos: {
            id: "contenedor-perfil",
            class: "perfil-contenedor"
        },
        hijos: [
            crearEncabezadoPerfil(),
            crearBloqueInformacion(usuario)
        ]
    });
}

export function crearBloqueInformacion(usuario) {
    return {
        tipo: "section",
        atributos: {
            class: "perfil-seccion",
            "aria-label": "Información personal"
        },
        hijos: [
            {
                tipo: "div",
                atributos: { class: "perfil-identidad" },
                hijos: [
                    {
                        tipo: "div",
                        atributos: { class: "perfil-identidad__foto" },
                        hijos: [
                            {
                                tipo: "img",
                                atributos: {
                                    class: "imagen-perfil",
                                    src: usuario.urlImagen,
                                    alt: "Foto de perfil"
                                }
                            }
                        ]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "perfil-identidad__contenido" },
                        hijos: [
                            {
                                tipo: "h2",
                                atributos: { class: "perfil-identidad__titulo" },
                                hijos: ["Este soy yo"]
                            },
                            {
                                tipo: "strong",
                                atributos: { class: "perfil-identidad__nombre" },
                                hijos: [usuario.nombre || "Sin nombre"]
                            },
                            {
                                tipo: "p",
                                atributos: { class: "perfil-identidad__frase" },
                                hijos: ["Este espacio también es para ti."]
                            },
                            {
                                tipo: "div",
                                atributos: { class: "perfil-resumen-textual" },
                                hijos: [
                                    {
                                        tipo: "p",
                                        hijos: [crearDescripcionPerfil(usuario)]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

function crearEncabezadoPerfil() {
    return {
        tipo: "header",
        atributos: { class: "perfil-encabezado" },
        hijos: [
            {
                tipo: "p",
                atributos: { class: "etiqueta-pantalla etiqueta-pantalla--perfil" },
                hijos: ["Mi espacio"]
            }
        ]
    };
}

function crearDescripcionPerfil(usuario) {
    const nivelAcademico = usuario?.nivelAcademico || "";
    const programa = usuario?.programa || "un programa no especificado";
    const semestre = usuario?.semestre || (nivelAcademico === "licenciatura" ? "un nivel no especificado" : "un semestre no especificado");
    const correo = usuario?.correo || "un correo no especificado";

    if (nivelAcademico === "licenciatura") {
        return `En la app apareces como estudiante de ${programa}, en nivel ${semestre}, con el correo ${correo}.`;
    }

    return `En la app apareces como estudiante de ${programa}, en ${semestre}, con el correo ${correo}.`;
}
