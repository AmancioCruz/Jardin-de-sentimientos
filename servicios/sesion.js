import { contenedores } from "../nucleo/contenedores_dom.js";
import { limpiarEstado } from "../nucleo/sistema_estados.js";
import { CerrarSesionAuth } from "./autenticacion.js";

export async function cerrarSesionApp() {
    try {
        if (!confirmarSalidaActividad()) return;

        await CerrarSesionAuth();
        limpiarEstado();
        contenedores.principal.classList.remove('con-menu');
        window.location.reload();
    } catch (error) {
        console.error('Error al cerrar sesion:', error);
    }
}

export function confirmarSalidaActividad() {
    if (!document.body.classList.contains('actividad-activa')) return true;

    const salir = confirm('¿Quieres finalizar esta actividad? Los datos que no hayas guardado se perderán.');
    if (!salir) return false;

    window.dispatchEvent(new CustomEvent('actividad:finalizada-sin-guardar'));
    contenedores.contenido.classList.remove('actividad-activa');
    document.body.classList.remove('actividad-activa');

    return true;
}
