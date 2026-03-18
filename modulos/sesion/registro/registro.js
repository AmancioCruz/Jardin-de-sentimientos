import { construirElemento } from "../../../utilidades/constructor_elementos.js";

/**
 * Crea formulario de registro completo
 * @param {Object} callbacks - { alEnviar, alVerTerminos, alIrAInicioSesion }
 * @returns {Elemento} Formulario de registro listo para montar
 */
export function crearRegistro({ alEnviar, alVerTerminos, alIrAInicioSesion, eventoFoto }) {
    const urlImagen = 'https://firebasestorage.googleapis.com/v0/b/jardin-de-sentimientos-b248a.firebasestorage.app/o/default_perfil.png?alt=media&token=ac962713-75be-4c20-a0ad-21d15adeba71';
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
                    class: 'formulario-registro-completo',
                    id: 'form-registro',
                    'aria-label': 'Formulario de registro'
                },
                eventos: {
                    submit: (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const datos = {
                            foto: formData.get('foto-perfil'),
                            nombre: formData.get('nombre'),
                            correo: formData.get('correo'),
                            programa: formData.get('programa'),
                            semestre: formData.get('semestre'),
                            sonido: formData.get('sonido'),
                            tema: formData.get('tema'),
                            contraseña: formData.get('contraseña'),
                            confirmarContraseña: formData.get('confirmar-contraseña'),
                            terminos: formData.get('terminos') === 'on'
                        };

                        // Validar contraseñas
                        if (datos.contraseña !== datos.confirmarContraseña) {
                            alert('Las contraseñas no coinciden');
                            return;
                        }

                        // Validar términos
                        if (!datos.terminos) {
                            alert('Debes aceptar los términos y condiciones');
                            return;
                        }

                        if (alEnviar && typeof alEnviar === 'function') {
                            const { confirmarContraseña, ...datosEnvio } = datos;
                            alEnviar(datosEnvio);
                        }
                    }
                },
                hijos: [
                    // Título y subtítulo
                    {
                        tipo: 'h2',
                        atributos: { class: 'titulo-formulario' },
                        hijos: ['Crear cuenta']
                    },


                    // ===== INFORMACIÓN PERSONAL =====
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Información personal']
                    },

                    // Foto de perfil
                    // Foto de perfil - SOLO ESTA PARTE CAMBIA
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
                                            alt: ''
                                        }
                                    },
                                    // LABEL como botón, input oculto dentro
                                    {
                                        tipo: 'label',
                                        atributos: {
                                            class: 'btn-primario btn-seleccionar',
                                            for: 'foto-perfil'  // conecta con el input
                                        },
                                        hijos: [
                                            { tipo: 'span', hijos: ['Seleccionar foto'] },
                                            // Input oculto dentro del label
                                            {
                                                tipo: 'input',
                                                atributos: {
                                                    type: 'file',
                                                    name: 'foto-perfil',
                                                    id: 'foto-perfil',  // id que conecta con label
                                                    accept: 'image/*',
                                                    hidden: true,  // oculto
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

                    // Nombre completo
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
                                            placeholder: 'Ej: María González',
                                            autocomplete: 'name',
                                            required: true
                                        }
                                    }
                                ]
                            }
                        ]
                    },

                    // Correo electrónico
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

                    // Programa académico
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

                    // Semestre
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
                                            {
                                                tipo: 'option',
                                                atributos: { value: '1° semestre' },
                                                hijos: ['1° semestre']
                                            },
                                            {
                                                tipo: 'option',
                                                atributos: { value: '2° semestre' },
                                                hijos: ['2° semestre']
                                            },
                                            {
                                                tipo: 'option',
                                                atributos: { value: '3° semestre' },
                                                hijos: ['3° semestre']
                                            },
                                            {
                                                tipo: 'option',
                                                atributos: { value: '4° semestre' },
                                                hijos: ['4° semestre']
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },

                    // ===== PREFERENCIAS INICIALES =====
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Preferencias iniciales']
                    },

                    // Sonido ambiente
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
                                    {
                                        tipo: 'option',
                                        atributos: { value: 'lluvia', selected: true },
                                        hijos: ['Lluvia']
                                    },
                                    {
                                        tipo: 'option',
                                        atributos: { value: 'bosque' },
                                        hijos: ['Bosque']
                                    },
                                    {
                                        tipo: 'option',
                                        atributos: { value: 'olas' },
                                        hijos: ['Olas']
                                    },
                                    {
                                        tipo: 'option',
                                        atributos: { value: 'silencio' },
                                        hijos: ['Silencio']
                                    }
                                ]
                            }
                        ]
                    },

                    // Tema visual
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
                                    {
                                        tipo: 'option',
                                        atributos: { value: 'claro' },
                                        hijos: ['Claro']
                                    },
                                    {
                                        tipo: 'option',
                                        atributos: { value: 'oscuro', selected: true },
                                        hijos: ['Oscuro']
                                    }
                                ]
                            }
                        ]
                    },

                    // ===== INFORMACIÓN DE ACCESO =====
                    {
                        tipo: 'h3',
                        atributos: { class: 'subtitulo-seccion' },
                        hijos: ['Información de acceso']
                    },

                    // Contraseña
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'contraseña'
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
                                                    name: 'contraseña',
                                                    id: 'contraseña',
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

                    // Confirmar contraseña
                    {
                        tipo: 'div',
                        atributos: { class: 'campo-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: {
                                    class: 'etiqueta-campo',
                                    for: 'confirmar-contraseña'
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
                                                    name: 'confirmar-contraseña',
                                                    id: 'confirmar-contraseña',
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

                    // ===== TÉRMINOS LEGALES =====
                    {
                        tipo: 'div',
                        atributos: { class: 'terminos-registro' },
                        hijos: [
                            {
                                tipo: 'label',
                                atributos: { class: 'label-terminos' },
                                hijos: [
                                    {
                                        tipo: 'input',
                                        atributos: {
                                            type: 'checkbox',
                                            name: 'terminos',
                                            id: 'terminos',
                                            autocomplete: 'off',
                                            required: true
                                        }
                                    },
                                    { tipo: 'span', hijos: ['Acepto los'] },
                                    {
                                        tipo: 'a',
                                        atributos: {
                                            href: '#',
                                            class: 'enlace-terminos'
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
                            }
                        ]
                    },

                    // Botón de registro
                    {
                        tipo: 'button',
                        atributos: {
                            type: 'submit',
                            class: 'btn-primario btn-ancho',
                            id: 'btn-registro'
                        },
                        hijos: ['Crear cuenta']
                    },

                    // Enlace a inicio de sesión
                    {
                        tipo: 'div',
                        atributos: { class: 'inicio-sesion' },
                        hijos: [
                            { tipo: 'span', hijos: ['¿Ya tienes una cuenta? '] },
                            {
                                tipo: 'a',
                                atributos: {
                                    href: '#',
                                    class: 'enlace-inicio-sesion',
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