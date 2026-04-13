import { construirElemento } from "../../../utilidades/constructor_elementos.js";

export function crearRegistro({ alEnviar, alVerTerminos, alIrAInicioSesion, eventoFoto }) {
    const urlImagen = './recursos/imagenes/default.webp';
    setTimeout(configurarFormularioRegistro, 0);

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
                    novalidate: true,
                    'aria-label': 'Formulario de registro'
                },
                eventos: {
                    submit: async (e) => {
                        e.preventDefault();
                        const formulario = e.currentTarget;
                        const formData = new FormData(formulario);

                        /* Este bloque convierte el formulario en un objeto simple
                           para que el gestor solo reciba datos listos para registrar. */
                        const datos = {
                            foto: formData.get('foto-perfil'),
                            nombre: formData.get('nombre'),
                            correo: formData.get('correo'),
                            programa: formData.get('programa'),
                            semestre: formData.get('semestre'),
                            contrasena: formData.get('contrasena'),
                            confirmarContrasena: formData.get('confirmar-contrasena'),
                            terminos: true
                        };

                        limpiarFeedbackFormulario(formulario);
                        const errores = validarRegistro(datos);

                        if (errores.length) {
                            mostrarErroresCampos(formulario, errores);
                            return;
                        }

                        if (alEnviar && typeof alEnviar === 'function') {
                            const { confirmarContrasena, ...datosEnvio } = datos;
                            await ejecutarRegistro(formulario, () => alEnviar(datosEnvio));
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
                        tipo: 'div',
                        atributos: {
                            class: 'feedback-formulario oculto',
                            id: 'feedback-registro',
                            role: 'status',
                            'aria-live': 'polite'
                        }
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
                                atributos: { class: 'fila-select' },
                                hijos: [
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

async function ejecutarRegistro(formulario, registrar) {
    const boton = formulario.querySelector('#btn-registro');
    const textoOriginal = boton?.textContent || 'Crear cuenta';

    if (boton) {
        boton.disabled = true;
        boton.textContent = 'Creando cuenta...';
    }

    mostrarFeedbackFormulario(formulario, 'Estamos creando tu cuenta. Espera un momento.', 'info');

    try {
        await registrar();
    } catch (error) {
        const errorRegistro = obtenerMensajeErrorRegistro(error);

        if (errorRegistro.campo) {
            mostrarErroresCampos(formulario, [errorRegistro]);
        } else {
            mostrarFeedbackFormulario(formulario, errorRegistro.mensaje, 'error');
        }
    } finally {
        if (boton?.isConnected) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    }
}

function validarRegistro(datos) {
    const foto = datos.foto;
    const errores = [];

    if (!datos.nombre?.trim()) {
        errores.push({ campo: 'nombre', mensaje: 'Escribe tu nombre completo.' });
    }

    if (!datos.correo?.trim()) {
        errores.push({ campo: 'correo', mensaje: 'Escribe tu correo electrónico.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
        errores.push({ campo: 'correo', mensaje: 'Escribe un correo electrónico válido.' });
    }

    if (!datos.programa?.trim()) {
        errores.push({ campo: 'programa', mensaje: 'Selecciona tu programa académico.' });
    }

    if (!datos.semestre?.trim()) {
        errores.push({ campo: 'semestre', mensaje: 'Selecciona tu semestre.' });
    }

    if (!datos.contrasena || datos.contrasena.length < 8) {
        errores.push({ campo: 'contrasena', mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    if (datos.contrasena !== datos.confirmarContrasena) {
        errores.push({ campo: 'confirmar-contrasena', mensaje: 'Las contraseñas no coinciden.' });
    }

    if (foto?.size > 0 && !['image/png', 'image/jpeg', 'image/webp'].includes(foto.type)) {
        errores.push({ campo: 'foto-perfil', mensaje: 'La foto debe ser PNG, JPG o WEBP. También puedes continuar sin foto.' });
    }

    return errores;
}

function mostrarFeedbackFormulario(formulario, mensaje, tipo = 'error', campo = '') {
    const feedback = formulario.querySelector('#feedback-registro');
    if (!feedback) return;

    feedback.textContent = mensaje;
    feedback.className = `feedback-formulario feedback-formulario--${tipo}`;
    feedback.classList.remove('oculto');

    if (campo) {
        const control = formulario.querySelector(`[name="${campo}"]`);
        const contenedorCampo = control?.closest('.campo-registro');

        contenedorCampo?.classList.add('campo-registro--error');
        control?.setAttribute('aria-invalid', 'true');
        control?.focus();
    }
}

function mostrarErroresCampos(formulario, errores = []) {
    if (!errores.length) return;

    errores.forEach(({ campo, mensaje }) => {
        const control = formulario.querySelector(`[name="${campo}"]`);
        const contenedorCampo = control?.closest('.campo-registro');

        if (!control || !contenedorCampo) {
            mostrarFeedbackFormulario(formulario, mensaje, 'error');
            return;
        }

        const idError = `error-${campo}`;
        let mensajeCampo = contenedorCampo.querySelector(`#${idError}`);

        if (!mensajeCampo) {
            mensajeCampo = document.createElement('p');
            mensajeCampo.id = idError;
            mensajeCampo.className = 'mensaje-error-campo';
            contenedorCampo.appendChild(mensajeCampo);
        }

        mensajeCampo.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i><span>${mensaje}</span>`;
        contenedorCampo.classList.add('campo-registro--error');
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('aria-describedby', idError);
    });

    const primerCampo = formulario.querySelector('.campo-registro--error [aria-invalid="true"]');
    primerCampo?.focus();
}

function limpiarFeedbackFormulario(formulario) {
    const feedback = formulario.querySelector('#feedback-registro');

    if (!feedback) return;

    feedback.classList.add('oculto');
    feedback.classList.remove('feedback-formulario--error', 'feedback-formulario--info', 'feedback-formulario--exito');
    feedback.textContent = '';

    formulario.querySelectorAll('.campo-registro--error').forEach((campo) => {
        campo.classList.remove('campo-registro--error');
    });

    formulario.querySelectorAll('.mensaje-error-campo').forEach((mensaje) => {
        mensaje.remove();
    });

    formulario.querySelectorAll('[aria-invalid="true"]').forEach((control) => {
        control.removeAttribute('aria-invalid');
        control.removeAttribute('aria-describedby');
    });
}

function obtenerMensajeErrorRegistro(error) {
    const codigo = error?.code || '';

    const mensajes = {
        'auth/email-already-in-use': { campo: 'correo', mensaje: 'Este correo ya tiene una cuenta registrada. Puedes iniciar sesión.' },
        'auth/invalid-email': { campo: 'correo', mensaje: 'El correo electrónico no tiene un formato válido.' },
        'auth/weak-password': { campo: 'contrasena', mensaje: 'La contraseña debe ser más segura. Usa al menos 8 caracteres.' },
        'auth/network-request-failed': { mensaje: 'No se pudo conectar con Firebase. Revisa tu conexión e inténtalo de nuevo.' },
        'PERMISSION_DENIED': { mensaje: 'No se pudieron guardar tus datos de perfil. Revisa las reglas de Firebase e inténtalo de nuevo.' }
    };

    return mensajes[codigo] || {
        mensaje: error?.message || 'No fue posible crear la cuenta. Revisa los datos e inténtalo de nuevo.'
    };
}

function configurarFormularioRegistro() {
    configurarSelectorPrograma();
    configurarLimpiezaErrores();
}

function configurarSelectorPrograma() {
    const campoPrograma = document.querySelector('#programa');
    if (!campoPrograma || campoPrograma.tagName === 'SELECT') return;

    const selector = document.createElement('select');
    selector.className = 'select-preferencia';
    selector.name = 'programa';
    selector.id = 'programa';
    selector.required = true;
    selector.autocomplete = 'off';
    selector.innerHTML = `
        <option value="" disabled selected>Selecciona tu programa</option>
        <option value="Maestría en Estudios y Procesos Creativos en Arte y Diseño">Maestría en Estudios y Procesos Creativos en Arte y Diseño</option>
        <option value="Otro">Otro</option>
    `;

    campoPrograma.replaceWith(selector);
}

function configurarLimpiezaErrores() {
    const formulario = document.querySelector('#form-registro');
    if (!formulario) return;

    formulario.querySelectorAll('input, select').forEach((control) => {
        control.addEventListener('input', () => limpiarErrorCampo(control));
        control.addEventListener('change', () => limpiarErrorCampo(control));
    });
}

function limpiarErrorCampo(control) {
    const contenedorCampo = control?.closest('.campo-registro');
    if (!contenedorCampo) return;

    contenedorCampo.classList.remove('campo-registro--error');
    contenedorCampo.querySelector('.mensaje-error-campo')?.remove();
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-describedby');
}
