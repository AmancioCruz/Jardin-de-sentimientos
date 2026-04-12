const claveTableroActivo = 'tableroActivo';

export function crearTableroActivo({ estado = 'Saturado Mentalmente' } = {}) {
    const tablero = {
        id: crypto.randomUUID(),
        estado,
        creadoEn: new Date().toISOString(),
        notas: [],
        guardado: false
    };

    localStorage.setItem(claveTableroActivo, JSON.stringify(tablero));
    return tablero;
}

export function obtenerOCrearTableroActivo({ estado = 'Saturado Mentalmente' } = {}) {
    return obtenerTableroActivo() || crearTableroActivo({ estado });
}

export function actualizarNotasTableroActivo(notas = []) {
    const tablero = obtenerTableroActivo();

    if (!tablero) return null;

    const actualizado = {
        ...tablero,
        notas,
        actualizadoEn: new Date().toISOString()
    };

    localStorage.setItem(claveTableroActivo, JSON.stringify(actualizado));
    return actualizado;
}

export function obtenerTableroActivo() {
    const guardado = localStorage.getItem(claveTableroActivo);

    if (!guardado) return null;

    try {
        const tablero = JSON.parse(guardado);
        return tablero?.guardado ? null : tablero;
    } catch {
        localStorage.removeItem(claveTableroActivo);
        return null;
    }
}

export function hayTableroActivo() {
    return Boolean(obtenerTableroActivo());
}

export function finalizarTableroActivo() {
    localStorage.removeItem(claveTableroActivo);
}
