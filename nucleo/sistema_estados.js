export const seccionesApp = {
    inicioSesion: 'Inicio Sesion',
    registro: 'Registro',
    inicio: 'Inicio',
    perfil: 'Perfil',
    bitacora: 'Bitacora'
};

let _estado = {
    sesionActiva: false,
    seccionActual: seccionesApp.inicioSesion
};

export function actualizarSeccion(seccion) {
    if (!Object.values(seccionesApp).includes(seccion)) {
        console.warn(`Seccion no valida: ${seccion}`);
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

function _guardarEnLocalStorage() {
    localStorage.setItem('estadoApp', JSON.stringify({
        sesionActiva: _estado.sesionActiva,
        seccionActual: _estado.seccionActual
    }));
}

export function inicializarDesdeLocalStorage() {
    const guardado = localStorage.getItem('estadoApp');

    if (guardado) {
        try {
            const datos = JSON.parse(guardado);
            _estado.sesionActiva = Boolean(datos.sesionActiva);
            _estado.seccionActual = Object.values(seccionesApp).includes(datos.seccionActual)
                ? datos.seccionActual
                : seccionesApp.inicioSesion;
        } catch {
            limpiarEstado();
        }
    }

    return {
        habiaSesion: _estado.sesionActiva,
        seccion: _estado.seccionActual
    };
}
