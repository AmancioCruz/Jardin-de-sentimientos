import '../modulos/sesion/inicio_sesion/gestor_inicio_sesion.js';
import '../modulos/sesion/registro/gestor_registro.js';
import '../modulos/inicio/gestor_inicio.js';
import '../modulos/mi_espacio/gestor_mi_espacio.js';
import '../modulos/configuracion/gestor_configuracion.js';
import '../modulos/recursos_apoyo/gestor_recursos_apoyo.js';
import '../modulos/ayuda_contactos/gestor_ayuda_contactos.js';

import { mostrarPantalla } from './gestor_pantallas.js';
import { inicializarDesdeLocalStorage, seccionesApp } from './sistema_estados.js';
import { haySesionActiva } from '../servicios/observador_sesiones.js';
import { componenteMenu, configurarCabecera } from '../componentes/menu_navegacion/gestor_menu_navegacion.js';
import { aplicarTemaLocal } from '../servicios/preferencias_locales.js';
import { contenedores } from './contenedores_dom.js';

export async function iniciarGestionSesion() {
    aplicarTemaLocal();
    const { habiaSesion, seccion } = inicializarDesdeLocalStorage();

    if (seccion === seccionesApp.registro) {
        limpiarInterfazAutenticada();
        mostrarPantalla(seccionesApp.registro);
        return;
    }

    if (!habiaSesion) {
        limpiarInterfazAutenticada();
        mostrarPantalla(seccionesApp.inicioSesion);
        return;
    }

    try {
        const usuario = await haySesionActiva();
        const destino = (seccion &&
            seccion !== seccionesApp.inicioSesion &&
            seccion !== seccionesApp.registro)
            ? normalizarDestino(seccion)
            : seccionesApp.inicio;

        componenteMenu(usuario);
        mostrarPantalla(destino, usuario);

    } catch {
        limpiarInterfazAutenticada();
        mostrarPantalla(seccionesApp.inicioSesion);
    }
}

function limpiarInterfazAutenticada() {
    document.querySelectorAll('.barra-navegacion-lateral').forEach((menu) => menu.remove());
    contenedores.principal.classList.remove('con-menu');
    contenedores.principal.classList.remove('menu-colapsado');
    contenedores.contenido.classList.remove('margen-por-barra-navegacion', 'actividad-activa');
    document.body.classList.remove('actividad-activa');
    configurarCabecera({ conSesion: false });
}

function normalizarDestino(seccion) {
    if (seccion === seccionesApp.perfil || seccion === seccionesApp.bitacora) {
        return seccionesApp.espacio;
    }

    return seccion;
}
