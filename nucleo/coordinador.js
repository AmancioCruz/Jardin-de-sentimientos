import '../modulos/sesion/inicio_sesion/gestor_inicio_sesion.js'
import '../modulos/sesion/registro/gestor_registro.js'
import '../modulos/inicio/gestor_inicio.js'
import '../modulos/perfil/gestor_perfil.js'

import { mostrarPantalla } from './gestor_pantallas.js'
import { inicializarDesdeLocalStorage, limpiarEstado, seccionesApp } from './sistema_estados.js';
import { haySesionActiva } from '../servicios/observador_sesiones.js';
import { componenteMenu } from '../componentes/menu_navegacion/gestor_menu_navegacion.js';
import { componenteInformacionUsuario } from '../componentes/informacion_usuario/gestor_informacion_usuario.js';

export async function iniciarGestionSesion() {
    console.log('iniciando la gestion');
    const { habiaSesion, seccion } = inicializarDesdeLocalStorage();

    if (!habiaSesion) {
        console.log('no hay sesion activa');
        mostrarPantalla(seccionesApp.inicioSesion);
        return;
    }

    try {
        const usuario = await haySesionActiva();
        const destino = (seccion !== seccionesApp.inicioSesion)
            ? seccion 
            : seccionesApp.inicio;

        componenteMenu(usuario);
        componenteInformacionUsuario(usuario.nombre);
        mostrarPantalla(destino, usuario);
    } catch {
        mostrarPantalla(seccionesApp.inicioSesion);
    }
}
