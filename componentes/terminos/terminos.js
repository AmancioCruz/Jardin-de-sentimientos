import { construirElemento } from "../../utilidades/constructor_elementos.js";

function crearSeccion(titulo, contenido) {
    return {
        tipo: 'div',
        atributos: { class: 'consentimiento-seccion' },
        hijos: [
            { tipo: 'h3', hijos: [titulo] },
            { tipo: 'p', hijos: [contenido] }
        ]
    };
}

export function crearConsentimiento({consentimientoData, alRegresar}) {

    const seccionesGeneradas = consentimientoData.secciones.map(sec =>
        crearSeccion(sec.titulo, sec.contenido)
    );

    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-consentimiento',
            class: 'contenedor-registro consentimiento-contenedor ',

        },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'card-consentimiento' },
                hijos: [

                    // Título
                    {
                        tipo: 'h2',
                        atributos: { class: 'consentimiento-titulo' },
                        hijos: [consentimientoData.titulo]
                    },

                    // Proyecto
                    {
                        tipo: 'p',
                        atributos: { class: 'consentimiento-proyecto' },
                        hijos: [consentimientoData.proyecto]
                    },

                    // Datos del proyecto
                    crearSeccion(
                        "Datos del proyecto",
                        consentimientoData.datos_proyecto
                    ),

                    // Secciones dinámicas
                    ...seccionesGeneradas,

                    {
                        tipo: 'button',
                        atributos: { class: 'btn-ancho btn-peligro espacio-inferior-m' },
                        eventos: {
                            click: (e) => {
                                e.preventDefault();
                                if (alRegresar && typeof alRegresar === 'function') {
                                    alRegresar(this);
                                }
                            }
                        },
                        hijos: ['Cerrar'],
                    }
                ]
            }
        ]
    });
}