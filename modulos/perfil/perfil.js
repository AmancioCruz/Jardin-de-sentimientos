import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function crearPerfil({ usuario }) {
    const config = usuario.configuraciones;

    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-perfil',
            class: 'perfil-contenedor'
        },
        hijos: [
            {
                tipo: 'section',
                atributos: {
                    class: 'seccion-informacion',
                    'aria-label': 'Información personal'
                },
                hijos: [
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Información Personal']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'dato-perfil-imagen' },
                        hijos: [
                            {
                                tipo: 'img',
                                atributos: {
                                    class: 'imagen-perfil',
                                    src: usuario.urlImagen,
                                    alt: 'Foto de perfil'
                                }
                            }
                        ]
                    },

                    crearDato('Nombre', usuario.nombre),
                    crearDato('Correo', usuario.correo),
                    crearDato('Programa', usuario.programa),
                    crearDato('Semestre', usuario.semestre)
                ]
            },

            // 🔊 SECCIÓN CONFIGURACIONES
            {
                tipo: 'section',
                atributos: {
                    class: 'seccion-configuracion',
                    'aria-label': 'Configuraciones'
                },
                hijos: [
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Configuraciones']
                    },

                    crearDato('Sonido', config?.sonido),
                    crearDato('Tema', config?.tema)
                ]
            }
        ]
    });
}

// reutilizable
function crearDato(etiqueta, valor) {
    return {
        tipo: 'div',
        atributos: { class: 'dato-perfil' },
        hijos: [
            {
                tipo: 'label',
                atributos: { class: 'etiqueta-dato' },
                hijos: [etiqueta]
            },
            {
                tipo: 'span',
                atributos: { class: 'valor-dato' },
                hijos: [valor || 'No especificado']
            }
        ]
    };
}