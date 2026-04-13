import { construirElemento } from "../../utilidades/constructor_elementos.js";

const actividadesInicio = [
    {
        estado: 'No Estoy Seguro',
        etiqueta: 'Orientación',
        titulo: 'No sé cómo me siento',
        descripcion: 'Responder unas preguntas para recibir una sugerencia.',
        icono: 'fa-solid fa-compass',
        clase: 'btn-no-seguro'
    },
    {
        estado: 'Saturado Mentalmente',
        etiqueta: 'Muchas tareas',
        titulo: 'Me siento saturado mentalmente',
        descripcion: 'Tengo mucho por hacer y poco tiempo.',
        icono: 'fa-solid fa-layer-group',
        clase: 'btn-jardin'
    },
    {
        estado: 'Pizarrón Creativo',
        etiqueta: 'Concentración',
        titulo: 'No me puedo concentrar',
        descripcion: 'Necesito ordenar mis ideas de forma visual.',
        icono: 'fa-solid fa-palette',
        clase: 'btn-pizarron'
    },
    {
        estado: 'Cansado',
        etiqueta: 'Cansancio',
        titulo: 'Me siento agotado',
        descripcion: 'Necesito una pausa para recuperar energía.',
        icono: 'fa-solid fa-wind',
        clase: 'btn-respiraciones'
    },
    {
        estado: 'Ansioso',
        etiqueta: 'Inquietud',
        titulo: 'Me siento ansioso',
        descripcion: 'Quiero calmar pensamientos que no se detienen.',
        icono: 'fa-solid fa-seedling',
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
                                hijos: ['Elige la opción que más se parece a lo que estás sintiendo ahora.']
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
                    { tipo: 'small', atributos: { class: 'estado-item' }, hijos: [actividad.etiqueta] },
                    { tipo: 'span', atributos: { class: 'estado-texto' }, hijos: [actividad.titulo] },
                    { tipo: 'span', atributos: { class: 'estado-descripcion' }, hijos: [actividad.descripcion] }
                ]
            }
        ]
    }));
}
