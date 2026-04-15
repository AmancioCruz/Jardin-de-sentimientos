import { construirElemento } from "../../utilidades/constructor_elementos.js";

const actividadesInicio = [
    {
        estado: 'No Estoy Seguro',
        titulo: 'No sé cómo me siento',
        descripcion: 'Responde unas preguntas breves para encontrar una actividad.',
        icono: 'fa-solid fa-compass',
        clase: 'btn-no-seguro'
    },
    {
        estado: 'Saturado Mentalmente',
        titulo: 'Me siento saturado mentalmente',
        descripcion: 'Quiero ordenar lo que pienso y lo que siento.',
        icono: 'fa-solid fa-brain',
        clase: 'btn-jardin'
    },
    {
        estado: 'Pizarrón Creativo',
        titulo: 'No me puedo concentrar',
        descripcion: 'Necesito aclarar mis ideas de forma visual.',
        icono: 'fa-solid fa-palette',
        clase: 'btn-pizarron'
    },
    {
        estado: 'Cansado',
        titulo: 'Me siento agotado',
        descripcion: 'Necesito una pausa tranquila para recuperar energía.',
        icono: 'fa-solid fa-wind',
        clase: 'btn-respiraciones'
    },
    {
        estado: 'Ansioso',
        titulo: 'Me siento bajo presión',
        descripcion: 'Quiero proteger mi bienestar de lo que me estresa.',
        icono: 'fa-solid fa-shield-halved',
        clase: 'btn-ansioso'
    }
];

export function crearInicio({ callbacks, usuario }) {
    const { alSeleccionarEstado, alNoEstoySeguro } = callbacks || {};

    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-inicio',
            class: 'inicio-contenedor'
        },
        hijos: [
            {
                tipo: 'h1',
                atributos: { class: 'titulo-pantalla inicio-titulo' },
                hijos: [`Hola ${usuario.nombre}`]
            },
            {
                tipo: 'section',
                atributos: { class: 'inicio-eleccion' },
                hijos: [
                    {
                        tipo: 'div',
                        atributos: { class: 'inicio-encabezado' },
                        hijos: [
                            {
                                tipo: 'h2',
                                atributos: { class: 'inicio-subtitulo' },
                                hijos: ['¿Cómo te sientes hoy?']
                            },
                            {
                                tipo: 'p',
                                atributos: { class: 'inicio-descripcion' },
                                hijos: ['Elige la opción que más se acerque a lo que estás sintiendo en este momento.']
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'evaluacion-rapida' },
                        hijos: crearBotonesActividades(actividadesInicio, alSeleccionarEstado, alNoEstoySeguro, usuario)
                    }
                ]
            }
        ]
    });
}

function crearBotonesActividades(actividades, alSeleccionarEstado, alNoEstoySeguro, usuario) {
    return actividades.map((actividad) => ({
        tipo: 'button',
        atributos: {
            class: `btn-estado ${actividad.clase}`,
            'data-estado': actividad.estado
        },
        eventos: {
            click: () => {
                if (actividad.estado === 'No Estoy Seguro') {
                    if (alNoEstoySeguro) alNoEstoySeguro(usuario);
                    return;
                }

                if (alSeleccionarEstado) alSeleccionarEstado(actividad.estado, usuario);
            }
        },
        hijos: [
            { tipo: 'i', atributos: { class: `${actividad.icono} estado-icono` } },
            {
                tipo: 'span',
                atributos: { class: 'estado-contenido' },
                hijos: [
                    { tipo: 'span', atributos: { class: 'estado-texto' }, hijos: [actividad.titulo] },
                    { tipo: 'span', atributos: { class: 'estado-descripcion' }, hijos: [actividad.descripcion] }
                ]
            }
        ]
    }));
}
