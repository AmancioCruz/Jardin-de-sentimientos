const clavePreferencias = 'preferenciasApp';

const preferenciasPorDefecto = {
    tema: '',
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
    const temaPreferido = tema || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');

    document.documentElement.setAttribute('data-theme', temaPreferido === 'oscuro' ? 'dark' : 'light');
}

export function obtenerSonidoActividad() {
    return obtenerPreferenciasLocales().sonido;
}
