const clavePreferencias = 'preferenciasApp';

const preferenciasPorDefecto = {
    tema: 'claro',
    sonido: 'silencio'
};

export function obtenerPreferenciasLocales() {
    try {
        const guardadas = JSON.parse(localStorage.getItem(clavePreferencias) || '{}');

        return {
            ...preferenciasPorDefecto,
            ...guardadas
        };
    } catch {
        return { ...preferenciasPorDefecto };
    }
}

export function guardarPreferenciaLocal(clave, valor) {
    const preferencias = obtenerPreferenciasLocales();

    preferencias[clave] = valor;
    localStorage.setItem(clavePreferencias, JSON.stringify(preferencias));

    if (clave === 'tema') {
        aplicarTemaLocal();
    }
}

export function aplicarTemaLocal() {
    const { tema } = obtenerPreferenciasLocales();
    document.documentElement.setAttribute('data-theme', tema === 'oscuro' ? 'dark' : 'light');
}

export function obtenerSonidoActividad() {
    return obtenerPreferenciasLocales().sonido;
}
