import { construirElemento } from "../../../utilidades/constructor_elementos.js";

export function crearInicioSesion({ alEnviar, alOlvideContrasena, alIrARegistro }) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-inicio-sesion'
        },
        hijos: [
            {
                tipo: 'form',
                atributos: {
                    class: 'formulario-app tarjeta-app tarjeta-app--elevada formulario-inicio-sesion',
                    id: 'form-inicio-sesion'
                },
                eventos: {
                    submit: (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const datos = {
                            correo: formData.get('correo'),
                            contrasena: formData.get('contrasena')
                        };

                        if (alEnviar && typeof alEnviar === 'function') {
                            alEnviar(datos);
                        }
                    }
                },
                hijos: [
                    {
                        tipo: 'h2',
                        atributos: { class: 'titulo-formulario' },
                        hijos: ['Iniciar sesión']
                    },
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
                    {
                        tipo: 'div',
                        atributos: { class: 'campo' },
                        hijos: [
                            { tipo: 'i', atributos: { class: 'fa-solid fa-lock' } },
                            {
                                tipo: 'input',
                                atributos: {
                                    type: 'password',
                                    name: 'contrasena',
                                    id: 'contrasena',
                                    placeholder: 'Contraseña',
                                    required: true
                                }
                            }
                        ]
                    },
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'submit',
                            class: 'btn-primario btn-ancho'
                        },
                        hijos: ['Iniciar sesión']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'registro texto-formulario' },
                        hijos: [
                            { tipo: 'span', hijos: ['¿No tienes cuenta? '] },
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#',
                                    class: 'enlace-app enlace-registro',
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
