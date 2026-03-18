// js/nucleo/sistema_estados.js

export const seccionesApp = {
    inicioSesion: 'Inicio Sesion',
    registro: 'Registro',
    inicio: 'Inicio',
    perfil: 'Perfil',
    bitacora: 'Bitacora',
    sisco: 'SISCO-SV21',
    jardin: 'Jardin',
    pizarra: 'Pizarra',
    respiraciones: 'Respiraciones'
};

let _estado = {
    sesionActiva: false,
    seccionActual: seccionesApp.inicioSesion
};

// ===== GETTERS =====

export function obtenerEstado() {
    return { ..._estado };
}

export function obtenerSeccion() {
    return _estado.seccionActual;
}

export function estaAutenticado() {
    return _estado.sesionActiva;
}

// ===== SETTERS =====

export function actualizarSeccion(seccion) {
    if (!Object.values(seccionesApp).includes(seccion)) {
        console.warn(`Sección no válida: ${seccion}`);
        return;
    }
    _estado.seccionActual = seccion;
    _guardarEnLocalStorage();
}

export function actualizarSesion(activa) {
    _estado.sesionActiva = activa;
    _guardarEnLocalStorage();
}

export function limpiarEstado() {
    _estado = {
        sesionActiva: false,
        seccionActual: seccionesApp.inicioSesion
    };
    localStorage.removeItem('estadoApp');
}

// ===== LOCALSTORAGE =====

function _guardarEnLocalStorage() {
    localStorage.setItem('estadoApp', JSON.stringify({
        sesionActiva: _estado.sesionActiva,
        seccionActual: _estado.seccionActual
    }));
}

/**
 * Carga estado desde localStorage y retorna info útil
 * @returns {Object} { habiaSesion, seccion }
 */
export function inicializarDesdeLocalStorage() {
    const guardado = localStorage.getItem('estadoApp');
    
    if (guardado) {
        const datos = JSON.parse(guardado);
        _estado.sesionActiva = datos.sesionActiva;
        _estado.seccionActual = datos.seccionActual;
    }
    
    return {
        habiaSesion: _estado.sesionActiva,
        seccion: _estado.seccionActual
    };
}