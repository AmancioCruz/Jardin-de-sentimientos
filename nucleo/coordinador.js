import '../modulos/sesion/inicio_sesion/gestor_inicio_sesion.js';
import '../modulos/sesion/registro/gestor_registro.js';
import '../modulos/inicio/gestor_inicio.js';
import '../modulos/perfil/gestor_perfil.js';
import '../modulos/bitacora/gestor_bitacora.js';

import { mostrarPantalla } from './gestor_pantallas.js';
import { inicializarDesdeLocalStorage, seccionesApp } from './sistema_estados.js';
import { haySesionActiva } from '../servicios/observador_sesiones.js';
import { componenteMenu } from '../componentes/menu_navegacion/gestor_menu_navegacion.js';
import { componenteInformacionUsuario } from '../componentes/informacion_usuario/gestor_informacion_usuario.js';
import { aplicarTemaLocal } from '../servicios/preferencias_locales.js';

export async function iniciarGestionSesion() {
    const { habiaSesion, seccion } = inicializarDesdeLocalStorage();

    if (seccion === seccionesApp.registro) {
        mostrarPantalla(seccionesApp.registro);
        return;
    }

    if (!habiaSesion) {
        mostrarPantalla(seccionesApp.inicioSesion);
        return;
    }

    try {
        const usuario = await haySesionActiva();
        const destino = (seccion &&
            seccion !== seccionesApp.inicioSesion &&
            seccion !== seccionesApp.registro)
            ? seccion
            : seccionesApp.inicio;

        aplicarTemaLocal();
        componenteMenu(usuario);
        componenteInformacionUsuario(usuario.nombre);
        mostrarPantalla(destino, usuario);

    } catch {
        mostrarPantalla(seccionesApp.inicioSesion);
    }
}
