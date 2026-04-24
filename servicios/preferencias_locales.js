const clavePreferencias = 'preferenciasApp';
const temasValidos = new Set(['claro', 'oscuro']);

const preferenciasPorDefecto = {
    tema: 'claro',
    sonido: 'silencio'
};

function normalizarTema(tema) {
    return temasValidos.has(tema) ? tema : preferenciasPorDefecto.tema;
}

function normalizarPreferencias(preferencias = {}) {
    return {
        ...preferenciasPorDefecto,
        ...preferencias,
        tema: normalizarTema(preferencias?.tema)
    };
}

export function obtenerPreferenciasLocales() {
    try {
        const guardadas = JSON.parse(localStorage.getItem(clavePreferencias) || '{}');
        const normalizadas = normalizarPreferencias(guardadas);

        if (JSON.stringify(guardadas) !== JSON.stringify(normalizadas)) {
            localStorage.setItem(clavePreferencias, JSON.stringify(normalizadas));
        }

        return normalizadas;
    } catch {
        const porDefecto = { ...preferenciasPorDefecto };
        localStorage.setItem(clavePreferencias, JSON.stringify(porDefecto));
        return porDefecto;
    }
}

export function guardarPreferenciaLocal(clave, valor) {
    const preferencias = obtenerPreferenciasLocales();

    preferencias[clave] = clave === 'tema' ? normalizarTema(valor) : valor;
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
