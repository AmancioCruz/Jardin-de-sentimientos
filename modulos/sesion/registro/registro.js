import { construirElemento } from "../../../utilidades/constructor_elementos.js";

export function crearRegistro({ alEnviar, alVerTerminos, alIrAInicioSesion, eventoFoto }) {
    const urlImagen = './recursos/imagenes/default.webp';

    return construirElemento({
        tipo: 'div',
        atributos: {
            class: 'contenedor-registro',
            id: 'contenedor-registro'
        },
        hijos: [
            {
                tipo: 'form',
                atributos: {
                    class: 'formulario-app tarjeta-app tarjeta-app--elevada formulario-registro-completo',
                    id: 'form-registro',
                    'aria-label': 'Formulario de registro'
                },
                eventos: {
                    submit: (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);

                        /* Este bloque convierte el formulario en un objeto simple
                           para que el gestor solo reciba datos listos para registrar. */
                        const datos = {
                            foto: formData.get('foto-perfil'),
                            nombre: formData.get('nombre'),
                            correo: formData.get('correo'),
                            programa: formData.get('programa'),
                            semestre: formData.get('semestre'),
                            sonido: formData.get('sonido'),
                            tema: formData.get('tema'),
                            contrasena: formData.get('contrasena'),
                            confirmarContrasena: formData.get('confirmar-contrasena'),
                            terminos: true
                        };

                        if (datos.contrasena !== datos.confirmarContrasena) {
                            alert('Las contraseñas no coinciden');
                            return;
                        }

                        if (alEnviar && typeof alEnviar === 'function') {
                            const { confirmarContrasena, ...datosEnvio } = datos;
                            alEnviar(datosEnvio);
                        }
                    }
                },
                hijos: [
                    {
                        tipo: 'h2',
                        atributos: { class: 'titulo-formulario' },
                        hijos: ['Crear cuenta']
                    },
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Información personal']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'foto-perfil'
                                },
                                hijos: ['Foto de perfil']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'campo-archivo' },
                                hijos: [
                                    {
                                        tipo: 'img',
                                        atributos: {
                                            id: 'imagen-seleccionada',
                                            class: 'imagen-seleccionada',
                                            src: urlImagen,
                                            alt: 'Foto de perfil seleccionada'
                                        }
                                    },
                                    {
                                        tipo: 'label',
                                        atributos: {
                                            class: 'btn-primario btn-seleccionar',
                                            for: 'foto-perfil'
                                        },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Seleccionar foto'] },
                                            {
                                                tipo: 'input',
                                                atributos: {
                                                    type: 'file',
                                                    name: 'foto-perfil',
                                                    id: 'foto-perfil',
                                                    accept: 'image/*',
                                                    hidden: true,
                                                },
                                                eventos: {
                                                    change: (e) => {
                                                        if (eventoFoto && typeof eventoFoto === 'function') {
                                                            eventoFoto(e);
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'nombre'
                                },
                                hijos: ['Nombre completo *']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'campo' },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-user' } },
                                    {
                                        tipo: 'input',
                                        atributos: {
                                            type: 'text',
                                            name: 'nombre',
                                            id: 'nombre',
                                            placeholder: 'Ej: Maria Gonzalez',
                                            autocomplete: 'name',
                                            required: true
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'correo'
                                },
                                hijos: ['Correo electrónico *']
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
                                            placeholder: 'ejemplo@uni.edu',
                                            autocomplete: 'email',
                                            required: true
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'programa'
                                },
                                hijos: ['Programa académico *']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'campo' },
                                hijos: [
                                    { tipo: 'i', atributos: { class: 'fa-solid fa-graduation-cap' } },
                                    {
                                        tipo: 'input',
                                        atributos: {
                                            type: 'text',
                                            name: 'programa',
                                            id: 'programa',
                                            placeholder: 'Ej: Maestría en Psicología',
                                            autocomplete: 'off',
                                            required: true
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'semestre'
                                },
                                hijos: ['Semestre *']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'fila-select' },
                                hijos: [
                                    {
                                        tipo: 'select',
                                        atributos: {
                                            class: 'select-preferencia',
                                            name: 'semestre',
                                            id: 'semestre',
                                            autocomplete: 'off',
                                            required: true
                                        },
                                        hijos: [
                                            {
                                                tipo: 'option',
                                                atributos: {
                                                    value: '',
                                                    disabled: true,
                                                    selected: true
                                                },
                                                hijos: ['Selecciona tu semestre']
                                            },
                                            { tipo: 'option', atributos: { value: '1 semestre' }, hijos: ['1 semestre'] },
                                            { tipo: 'option', atributos: { value: '2 semestre' }, hijos: ['2 semestre'] },
                                            { tipo: 'option', atributos: { value: '3 semestre' }, hijos: ['3 semestre'] },
                                            { tipo: 'option', atributos: { value: '4 semestre' }, hijos: ['4 semestre'] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Preferencias iniciales']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'select-sonido'
                                },
                                hijos: ['Sonido ambiente']
                            },
                            {
                                tipo: 'select',
                                atributos: {
                                    class: 'select-preferencia',
                                    name: 'sonido',
                                    id: 'select-sonido',
                                    autocomplete: 'off'
                                },
                                hijos: [
                                    { tipo: 'option', atributos: { value: 'lluvia', selected: true }, hijos: ['Lluvia'] },
                                    { tipo: 'option', atributos: { value: 'bosque' }, hijos: ['Bosque'] },
                                    { tipo: 'option', atributos: { value: 'olas' }, hijos: ['Olas'] },
                                    { tipo: 'option', atributos: { value: 'silencio' }, hijos: ['Silencio'] }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'select-tema'
                                },
                                hijos: ['Tema visual']
                            },
                            {
                                tipo: 'select',
                                atributos: {
                                    class: 'select-preferencia',
                                    name: 'tema',
                                    id: 'select-tema',
                                    autocomplete: 'off'
                                },
                                hijos: [
                                    { tipo: 'option', atributos: { value: 'claro' }, hijos: ['Claro'] },
                                    { tipo: 'option', atributos: { value: 'oscuro', selected: true }, hijos: ['Oscuro'] }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                                hijos: ['Información de acceso']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'contrasena'
                                },
                                hijos: ['Contraseña *']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'campo-con-boton' },
                                hijos: [
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
                                                    placeholder: 'Mínimo 8 caracteres',
                                                    autocomplete: 'new-password',
                                                    minlength: 8,
                                                    required: true
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'confirmar-contrasena'
                                },
                                hijos: ['Confirmar contraseña *']
                            },
                            {
                                tipo: 'div',
                                atributos: { class: 'campo-con-boton' },
                                hijos: [
                                    {
                                        tipo: 'div',
                                        atributos: { class: 'campo' },
                                        hijos: [
                                            { tipo: 'i', atributos: { class: 'fa-solid fa-lock' } },
                                            {
                                                tipo: 'input',
                                                atributos: {
                                                    type: 'password',
                                                    name: 'confirmar-contrasena',
                                                    id: 'confirmar-contrasena',
                                                    placeholder: 'Repite la contraseña',
                                                    autocomplete: 'new-password',
                                                    minlength: 8,
                                                    required: true
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'terminos-registro texto-formulario' },
                        hijos: [
                            { tipo: 'span', hijos: ['Al crear la cuenta aceptas los '] },
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#',
                                    class: 'enlace-app enlace-terminos'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alVerTerminos && typeof alVerTerminos === 'function') {
                                            alVerTerminos();
                                        }
                                    }
                                },
                                hijos: ['términos y condiciones']
                            }
                        ]
                    },
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'submit',
                            class: 'btn-primario btn-ancho',
                            id: 'btn-registro'
                        },
                        hijos: ['Crear cuenta']
                    },
                    {
                        tipo: 'div',
                        atributos: { class: 'inicio-sesion texto-formulario' },
                        hijos: [
                            { tipo: 'span', hijos: ['¿Ya tienes una cuenta? '] },
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#',
                                    class: 'enlace-app enlace-inicio-sesion',
                                    id: 'link-inicio-sesion'
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alIrAInicioSesion && typeof alIrAInicioSesion === 'function') {
                                            alIrAInicioSesion();
                                        }
                                    }
                                },
                                hijos: ['Inicia sesión']
                            }
                        ]
                    }
                ]
            }
        ]
    });
}
