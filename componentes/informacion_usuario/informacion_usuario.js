import { construirElemento } from "../../utilidades/constructor_elementos.js";

/**
 * Crea el componente de información del usuario
 * @param {string} nombre_usuario - Nombre que se le da al usuario
 * @param {Function|null} [cerrarSesion] - Función para cerrar sesión
 */
export function crearInformacionUsuario({nombre_usuario, cerrarSesion = null}) {
    return construirElemento(
        {
            tipo: 'div',
            atributos: { class: 'info-usuario' },
            hijos: [
                {
                    tipo: 'span',
                    atributos: { class: 'nombre-usuario' },
                    hijos: [nombre_usuario]
                },
                {
                    tipo: 'button',
                    atributos: {
                        class: 'btn-fantasma btn-pequeno',
                    },
                    hijos: [
                        { tipo: 'i', atributos: { class: 'fa-solid fa-sign-out-alt' } },
                        ' Salir'
                    ],
                    eventos: {
                        click: typeof cerrarSesion === 'function'
                            ? (event) => cerrarSesion(event)
                            : null
                    }
                }
            ]
        }
    )
}