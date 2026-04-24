const overlaysActivos = new Map();

export function activarOverlay(clave, { usarBackdrop = false, zIndex = 1100, alClickBackdrop = null } = {}) {
    if (!clave) return null;

    if (overlaysActivos.has(clave)) {
        document.body.classList.add("overlay-activo");
        return overlaysActivos.get(clave)?.backdrop || null;
    }

    let backdrop = null;

    if (usarBackdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "overlay-backdrop";
        backdrop.dataset.overlayClave = clave;
        backdrop.style.zIndex = String(zIndex);

        if (typeof alClickBackdrop === "function") {
            backdrop.addEventListener("click", alClickBackdrop);
        }

        document.body.appendChild(backdrop);
    }

    overlaysActivos.set(clave, { backdrop });
    document.body.classList.add("overlay-activo");

    return backdrop;
}

export function desactivarOverlay(clave) {
    if (!clave || !overlaysActivos.has(clave)) return;

    const registro = overlaysActivos.get(clave);
    registro?.backdrop?.remove();
    overlaysActivos.delete(clave);

    if (overlaysActivos.size === 0) {
        document.body.classList.remove("overlay-activo");
    }
}

export function limpiarOverlaysActivos() {
    overlaysActivos.forEach((registro) => registro?.backdrop?.remove());
    overlaysActivos.clear();
    document.body.classList.remove("overlay-activo");
}
