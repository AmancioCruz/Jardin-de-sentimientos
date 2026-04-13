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
        mostrarEstadoBitacora(galeria, 'Inicia sesión para ver tus actividades.');
        return;
    }

    const actividades = await obtenerActividadesUsuario(usuario.uid);

    if (!actividades.length) {
        mostrarEstadoBitacora(galeria, 'Todavía no hay actividades guardadas.');
        return;
    }

    galeria.replaceChildren();
    actividades.forEach((actividad) => {
        galeria.appendChild(crearTarjetaActividad(actividad));
    });
}

function mostrarEstadoBitacora(galeria, mensaje) {
    const estado = document.createElement('p');
    estado.className = 'bitacora-estado';
    estado.textContent = mensaje;
    galeria.replaceChildren(estado);
}

function crearTarjetaActividad(actividad) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'bitacora-tarjeta';

    const botonImagen = document.createElement('button');
    botonImagen.type = 'button';
    botonImagen.className = 'bitacora-tarjeta__imagen';
    botonImagen.setAttribute('aria-label', `Abrir actividad ${actividad.nombreActividad || ''}`);

    if (actividad.imagenUrl) {
        const imagen = document.createElement('img');
        imagen.src = actividad.imagenUrl;
        imagen.alt = `Actividad ${actividad.nombreActividad || ''}`;
        botonImagen.appendChild(imagen);
    } else {
        const sinImagen = document.createElement('span');
        sinImagen.textContent = 'Sin imagen';
        botonImagen.appendChild(sinImagen);
    }

    const contenido = document.createElement('div');
    contenido.className = 'bitacora-tarjeta__contenido';

    const nombre = document.createElement('strong');
    nombre.textContent = formatearNombreActividad(actividad.nombreActividad);

    const fecha = document.createElement('span');
    fecha.textContent = `${actividad.fecha || ''} ${actividad.hora || ''}`.trim();

    const respuesta = document.createElement('small');
    respuesta.textContent = actividad.respuesta || 'Sin respuesta registrada';

    contenido.append(nombre, fecha, respuesta);
    tarjeta.append(botonImagen, contenido);
    botonImagen.addEventListener('click', () => abrirDetalleActividad(actividad));

    return tarjeta;
}

function abrirDetalleActividad(actividad) {
    cerrarDetalleActividad();

    const modal = document.createElement('div');
    modal.className = 'bitacora-detalle';
    modal.id = 'bitacora-detalle';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'bitacora-detalle__tarjeta';
    tarjeta.setAttribute('role', 'dialog');
    tarjeta.setAttribute('aria-modal', 'true');
    tarjeta.setAttribute('aria-labelledby', 'bitacora-detalle-titulo');

    const cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.className = 'bitacora-detalle__cerrar';
    cerrar.setAttribute('aria-label', 'Cerrar');
    cerrar.appendChild(crearIcono('fa-solid fa-xmark'));

    const medio = crearMedioDetalle(actividad);
    const info = crearInfoDetalle(actividad);

    const descargar = document.createElement('button');
    descargar.type = 'button';
    descargar.className = 'btn-actividad-salir bitacora-detalle__descargar';
    descargar.append(crearIcono('fa-solid fa-download'), document.createTextNode('Descargar'));

    tarjeta.append(cerrar, medio, info, descargar);
    modal.appendChild(tarjeta);

    cerrar.addEventListener('click', cerrarDetalleActividad);
    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) cerrarDetalleActividad();
    });
    descargar.addEventListener('click', () => descargarActividad(actividad));
    document.body.appendChild(modal);
}

function crearMedioDetalle(actividad) {
    if (!actividad.imagenUrl) {
        const sinImagen = document.createElement('div');
        sinImagen.className = 'bitacora-detalle__sin-imagen';
        sinImagen.textContent = 'Sin imagen guardada';
        return sinImagen;
    }

    const imagen = document.createElement('img');
    imagen.src = actividad.imagenUrl;
    imagen.alt = `Actividad ${actividad.nombreActividad || ''}`;
    return imagen;
}

function crearInfoDetalle(actividad) {
    const info = document.createElement('div');
    info.className = 'bitacora-detalle__info';

    const titulo = document.createElement('h2');
    titulo.id = 'bitacora-detalle-titulo';
    titulo.textContent = formatearNombreActividad(actividad.nombreActividad);

    info.append(
        titulo,
        crearLineaInfo('Respuesta:', actividad.respuesta || 'Sin respuesta registrada'),
        crearLineaInfo('Fecha:', actividad.fecha || ''),
        crearLineaInfo('Hora:', actividad.hora || '')
    );

    return info;
}

function crearLineaInfo(etiqueta, valor) {
    const linea = document.createElement('p');
    const titulo = document.createElement('strong');
    titulo.textContent = `${etiqueta} `;
    linea.append(titulo, document.createTextNode(valor));
    return linea;
}

function crearIcono(clase) {
    const icono = document.createElement('i');
    icono.className = clase;
    return icono;
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
