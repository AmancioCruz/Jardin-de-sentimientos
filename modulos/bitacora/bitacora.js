import { obtenerActividadesUsuario } from "../../servicios/base_datos.js";
import { construirElemento } from "../../utilidades/constructor_elementos.js";

export function mostrarBitacora({ usuario } = {}) {
    const vista = construirElemento({
        tipo: 'section',
        atributos: {
            id: 'contenedor-bitacora',
            class: 'bitacora-contenedor'
        },
        hijos: [
            {
                tipo: 'div',
                atributos: { class: 'bitacora-encabezado' },
                hijos: [
                    { tipo: 'h1', atributos: { class: 'titulo-seccion-app' }, hijos: ['Bitácora'] },
                    { tipo: 'p', hijos: ['Aquí aparecerán las actividades que guardes.'] }
                ]
            },
            {
                tipo: 'div',
                atributos: {
                    class: 'bitacora-galeria',
                    'data-galeria-bitacora': ''
                },
                hijos: [
                    { tipo: 'p', atributos: { class: 'bitacora-estado' }, hijos: ['Cargando actividades...'] }
                ]
            }
        ]
    });

    setTimeout(() => cargarActividades(vista.nodo, usuario), 0);

    return vista;
}

async function cargarActividades(nodo, usuario) {
    const galeria = nodo?.querySelector('[data-galeria-bitacora]');

    if (!galeria) return;

    if (!usuario?.uid) {
        galeria.innerHTML = '<p class="bitacora-estado">Inicia sesión para ver tus actividades.</p>';
        return;
    }

    const actividades = await obtenerActividadesUsuario(usuario.uid);

    if (!actividades.length) {
        galeria.innerHTML = '<p class="bitacora-estado">Todavía no hay actividades guardadas.</p>';
        return;
    }

    galeria.innerHTML = '';
    actividades.forEach((actividad) => {
        galeria.appendChild(crearTarjetaActividad(actividad));
    });
}

function crearTarjetaActividad(actividad) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'bitacora-tarjeta';
    tarjeta.innerHTML = `
        <button type="button" class="bitacora-tarjeta__imagen" aria-label="Abrir actividad ${actividad.nombreActividad || ''}">
            ${actividad.imagenUrl
                ? `<img src="${actividad.imagenUrl}" alt="Actividad ${actividad.nombreActividad || ''}">`
                : '<span>Sin imagen</span>'}
        </button>
        <div class="bitacora-tarjeta__contenido">
            <strong>${formatearNombreActividad(actividad.nombreActividad)}</strong>
            <span>${actividad.fecha || ''} ${actividad.hora || ''}</span>
            <small>${actividad.respuesta || 'Sin respuesta registrada'}</small>
        </div>
    `;

    tarjeta.querySelector('button')?.addEventListener('click', () => abrirDetalleActividad(actividad));

    return tarjeta;
}

function abrirDetalleActividad(actividad) {
    cerrarDetalleActividad();

    const modal = document.createElement('div');
    modal.className = 'bitacora-detalle';
    modal.id = 'bitacora-detalle';
    modal.innerHTML = `
        <div class="bitacora-detalle__tarjeta" role="dialog" aria-modal="true" aria-labelledby="bitacora-detalle-titulo">
            <button type="button" class="bitacora-detalle__cerrar" aria-label="Cerrar">
                <i class="fa-solid fa-xmark"></i>
            </button>
            ${actividad.imagenUrl
                ? `<img src="${actividad.imagenUrl}" alt="Actividad ${actividad.nombreActividad || ''}">`
                : '<div class="bitacora-detalle__sin-imagen">Sin imagen guardada</div>'}
            <div class="bitacora-detalle__info">
                <h2 id="bitacora-detalle-titulo">${formatearNombreActividad(actividad.nombreActividad)}</h2>
                <p><strong>Respuesta:</strong> ${actividad.respuesta || 'Sin respuesta registrada'}</p>
                <p><strong>Fecha:</strong> ${actividad.fecha || ''}</p>
                <p><strong>Hora:</strong> ${actividad.hora || ''}</p>
            </div>
            <button type="button" class="btn-actividad-salir bitacora-detalle__descargar">
                <i class="fa-solid fa-download"></i>
                Descargar
            </button>
        </div>
    `;

    modal.querySelector('.bitacora-detalle__cerrar')?.addEventListener('click', cerrarDetalleActividad);
    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) cerrarDetalleActividad();
    });
    modal.querySelector('.bitacora-detalle__descargar')?.addEventListener('click', () => descargarActividad(actividad));
    document.body.appendChild(modal);
}

function cerrarDetalleActividad() {
    document.getElementById('bitacora-detalle')?.remove();
}

function descargarActividad(actividad) {
    if (!actividad.imagenUrl) return;

    const enlace = document.createElement('a');
    enlace.href = actividad.imagenUrl;
    enlace.download = `${actividad.nombreActividad || 'actividad'}_${actividad.fecha || 'imagen'}.jpg`;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    enlace.click();
}

function formatearNombreActividad(nombre = '') {
    const nombres = {
        tablero: 'Tablero',
        juego: 'Riega tu calma',
        respiracion: 'Respiración guiada',
        pizarron: 'Pizarrón creativo'
    };

    return nombres[nombre] || nombre || 'Actividad';
}
