import { construirElemento } from "../../../utilidades/constructor_elementos.js";

/**
 * Crea formulario de inicio de sesión
 * @param {Object} callbacks - { alEnviar, alOlvideContrasena, alIrARegistro }
 * @returns {Elemento} Formulario listo para montar
 */
export function crearInicioSesion({ alEnviar, alOlvideContrasena, alIrARegistro }) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedo-inicio-sesion'
        },
        hijos: [
            {
                tipo: 'form',
                atributos: {
                    class: 'formulario-inicio-sesion',
                    id: 'form-inicio-sesion'
                },
                eventos: {
                    submit: (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const datos = Object.fromEntries(formData.entries());

                        if (alEnviar && typeof alEnviar === 'function') {
                            alEnviar(datos);
                        }
                    }
                },
                hijos: [
                    // Título
                    {
                        tipo: 'h2',
                        atributos: { class: 'titulo-formulario' },
                        hijos: ['Iniciar Sesión']
                    },
                    // Campo correo
                    {
                        tipo: 'div',
                        atributos: { class: 'campo' },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-envelope' } },
                            {
                                tipo: 'input',
                                atributos: {
                                    type: 'email',
                                    name: 'correo',
                                    id: 'correo',
                                    placeholder: 'Correo electrónico',
                                    required: true
                                }
                            }
                        ]
                    },
                    // Campo contraseña
                    {
                        tipo: 'div',
                        atributos: { class: 'campo' },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-lock' } },
                            {
                                tipo: 'input',
                                atributos: {
                                    type: 'password',
                                    name: 'contraseña',
                                    id: 'contraseña',
                                    placeholder: 'Contraseña',
                                    required: true
                                }
                            }
                        ]
                    },
                    // Opciones (recordar y olvidé contraseña)
                    /*{
                        tipo: 'div',
                        atributos: { class: 'opciones' },
                        hijos: [
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#',
                                    class: 'enlace-olvide',
                                    id: 'olvide-contrasena'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alOlvideContrasena && typeof alOlvideContrasena === 'function') {
                                            alOlvideContrasena();
                                        }
                                    }
                                },
                                hijos: ['¿Olvidaste tu contraseña?']
                            }
                        ]
                    },*/
                    // Botón submit
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'submit',
                            class: 'btn-primario btn-ancho'
                        },
                        hijos: ['Iniciar Sesión']
                    },
                    // Enlace a registro
                    {
                        tipo: 'div',
                        atributos: { class: 'registro' },
                        hijos: [
                            { tipo: 'span', hijos: ['¿No tienes cuenta? '] },
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#',
                                    class: 'enlace-registro',
                                    id: 'link-registro'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alIrARegistro && typeof alIrARegistro === 'function') {
                                            alIrARegistro();
                                        }
                                    }
                                },
                                hijos: ['Regístrate']
                            }
                        ]
                    }
                ]
            }
        ]
    });
}