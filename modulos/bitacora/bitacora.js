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
                    { tipo: 'p', hijos: ['Tus actividades guardadas se organizan por fecha.'] }
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

    agruparActividadesPorFecha(actividades).forEach(([fecha, actividadesDia]) => {
        galeria.appendChild(crearGrupoFecha(fecha, actividadesDia));
    });
}

function mostrarEstadoBitacora(galeria, mensaje) {
    const estado = document.createElement('p');
    estado.className = 'bitacora-estado';
    estado.textContent = mensaje;
    galeria.replaceChildren(estado);
}

function agruparActividadesPorFecha(actividades) {
    const grupos = new Map();

    actividades.forEach((actividad) => {
        const fecha = actividad.fecha || 'Sin fecha';

        if (!grupos.has(fecha)) {
            grupos.set(fecha, []);
        }

        grupos.get(fecha).push(actividad);
    });

    return [...grupos.entries()];
}

function crearGrupoFecha(fecha, actividades) {
    const grupo = document.createElement('section');
    grupo.className = 'bitacora-grupo-fecha';

    const encabezado = document.createElement('header');
    encabezado.className = 'bitacora-fecha';

    const titulo = document.createElement('h2');
    titulo.textContent = formatearFecha(fecha);

    const contador = document.createElement('span');
    contador.textContent = `${actividades.length} actividad${actividades.length === 1 ? '' : 'es'}`;

    const mosaico = document.createElement('div');
    mosaico.className = 'bitacora-mosaico';

    actividades.forEach((actividad) => {
        mosaico.appendChild(crearTarjetaActividad(actividad));
    });

    encabezado.append(titulo, contador);
    grupo.append(encabezado, mosaico);

    return grupo;
}

function crearTarjetaActividad(actividad) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'bitacora-tarjeta';

    const botonImagen = document.createElement('button');
    botonImagen.type = 'button';
    botonImagen.className = 'bitacora-tarjeta__imagen';
    botonImagen.setAttribute('aria-label', `Abrir actividad ${formatearNombreActividad(actividad.nombreActividad)}`);

    if (actividad.imagenUrl) {
        const imagen = document.createElement('img');
        imagen.src = actividad.imagenUrl;
        imagen.alt = `Actividad ${formatearNombreActividad(actividad.nombreActividad)}`;
        botonImagen.appendChild(imagen);
    } else {
        const sinImagen = document.createElement('span');
        sinImagen.textContent = 'Sin imagen';
        botonImagen.appendChild(sinImagen);
    }

    const etiqueta = document.createElement('span');
    etiqueta.className = 'bitacora-tarjeta__etiqueta';
    etiqueta.textContent = formatearNombreActividad(actividad.nombreActividad);

    const hora = document.createElement('span');
    hora.className = 'bitacora-tarjeta__hora';
    hora.textContent = actividad.hora || '';

    botonImagen.append(etiqueta, hora);
    tarjeta.appendChild(botonImagen);
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
    imagen.alt = `Actividad ${formatearNombreActividad(actividad.nombreActividad)}`;
    return imagen;
}

function crearInfoDetalle(actividad) {
    const info = document.createElement('div');
    info.className = 'bitacora-detalle__info';

    const titulo = document.createElement('h2');
    titulo.id = 'bitacora-detalle-titulo';
    titulo.textContent = formatearNombreActividad(actividad.nombreActividad);

    const lineas = [
        titulo,
        crearLineaInfo('Respuesta:', actividad.respuesta || 'Sin respuesta registrada'),
        crearLineaInfo('Fecha:', formatearFecha(actividad.fecha || '')),
        crearLineaInfo('Hora:', actividad.hora || '')
    ];

    if (actividad.comentario) {
        lineas.push(crearLineaInfo('Comentario:', actividad.comentario));
    }

    info.append(...lineas);

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

function formatearFecha(fecha = '') {
    if (!fecha || fecha === 'Sin fecha') return fecha || 'Sin fecha';

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaLocal = new Date(anio, (mes || 1) - 1, dia || 1);

    return new Intl.DateTimeFormat('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(fechaLocal);
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
