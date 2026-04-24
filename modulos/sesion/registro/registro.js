import { construirElemento } from "../../../utilidades/constructor_elementos.js";

const OPCIONES_ACADEMICAS = {
    maestria: {
        programas: [
            "Maestría en Estudios y Procesos Creativos en Arte y Diseño",
            "Otro"
        ],
        avanceEtiqueta: "Semestre *",
        avancePlaceholder: "Selecciona tu semestre",
        avances: ["Semestre 1", "Semestre 2", "Semestre 3", "Semestre 4"]
    },
    licenciatura: {
        programas: [
            "Licenciatura en Diseño Digital de Medios Interactivos",
            "Otro"
        ],
        avanceEtiqueta: "Nivel *",
        avancePlaceholder: "Selecciona tu nivel",
        avances: ["Principiante", "Intermedio", "Avanzado", "Próximo a egresar"]
    }
};

export function crearRegistro({ alEnviar, alVerTerminos, alIrAInicioSesion, eventoFoto }) {
    const urlImagen = "./recursos/imagenes/default.webp";
    setTimeout(configurarFormularioRegistro, 0);

    return construirElemento({
        tipo: "div",
        atributos: {
            class: "contenedor-registro",
            id: "contenedor-registro"
        },
        hijos: [
            {
                tipo: "form",
                atributos: {
                    class: "formulario-app tarjeta-app tarjeta-app--elevada formulario-registro-completo",
                    id: "form-registro",
                    novalidate: true,
                    "aria-label": "Formulario de registro"
                },
                eventos: {
                    submit: async (e) => {
                        e.preventDefault();
                        const formulario = e.currentTarget;
                        const formData = new FormData(formulario);
                        const programaSeleccionado = formData.get("programa");
                        const programaPersonalizado = formData.get("programa-personalizado");

                        const datos = {
                            foto: formData.get("foto-perfil"),
                            nombre: formData.get("nombre"),
                            correo: formData.get("correo"),
                            nivelAcademico: formData.get("nivel-academico"),
                            programaSeleccionado,
                            programaPersonalizado,
                            programa: resolverProgramaRegistro(programaSeleccionado, programaPersonalizado),
                            semestre: formData.get("semestre"),
                            contrasena: formData.get("contrasena"),
                            confirmarContrasena: formData.get("confirmar-contrasena"),
                            terminos: true
                        };

                        limpiarFeedbackFormulario(formulario);
                        const errores = validarRegistro(datos);

                        if (errores.length) {
                            mostrarErroresCampos(formulario, errores);
                            return;
                        }

                        if (typeof alEnviar === "function") {
                            const { confirmarContrasena, programaSeleccionado: _, programaPersonalizado: __, ...datosEnvio } = datos;
                            await ejecutarRegistro(formulario, () => alEnviar(datosEnvio));
                        }
                    }
                },
                hijos: [
                    {
                        tipo: "h2",
                        atributos: { class: "titulo-formulario" },
                        hijos: ["Crear cuenta"]
                    },
                    {
                        tipo: "div",
                        atributos: {
                            class: "feedback-formulario oculto",
                            id: "feedback-registro",
                            role: "status",
                            "aria-live": "polite"
                        }
                    },
                    {
                        tipo: "h3",
                        atributos: { class: "subtitulo-seccion" },
                        hijos: ["Información personal"]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "campo-registro" },
                        hijos: [
                            {
                                tipo: "label",
                                atributos: {
                                    class: "etiqueta-campo",
                                    for: "foto-perfil"
                                },
                                hijos: ["Foto de perfil"]
                            },
                            {
                                tipo: "div",
                                atributos: { class: "campo-archivo" },
                                hijos: [
                                    {
                                        tipo: "img",
                                        atributos: {
                                            id: "imagen-seleccionada",
                                            class: "imagen-seleccionada",
                                            src: urlImagen,
                                            alt: "Foto de perfil seleccionada"
                                        }
                                    },
                                    {
                                        tipo: "label",
                                        atributos: {
                                            class: "btn-primario btn-seleccionar",
                                            for: "foto-perfil"
                                        },
                                        hijos: [
                                            { tipo: "span", hijos: ["Seleccionar foto"] },
                                            {
                                                tipo: "input",
                                                atributos: {
                                                    type: "file",
                                                    name: "foto-perfil",
                                                    id: "foto-perfil",
                                                    accept: "image/*",
                                                    hidden: true
                                                },
                                                eventos: {
                                                    change: (e) => {
                                                        if (typeof eventoFoto === "function") {
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
                    crearCampoTexto({
                        id: "nombre",
                        icono: "fa-solid fa-user",
                        etiqueta: "Nombre de usuario o apodo *",
                        placeholder: "Ej: Mari, Mateo o Jardín21",
                        autocomplete: "nickname",
                        required: true
                    }),
                    crearCampoTexto({
                        id: "correo",
                        icono: "fa-solid fa-envelope",
                        etiqueta: "Correo electrónico *",
                        placeholder: "ejemplo@uni.edu",
                        autocomplete: "email",
                        type: "email",
                        required: true
                    }),
                    crearCampoSelect({
                        id: "nivel-academico",
                        etiqueta: "Nivel académico *",
                        opciones: [
                            { value: "", label: "Selecciona tu nivel académico", disabled: true, selected: true },
                            { value: "maestria", label: "Estudiante de maestría" },
                            { value: "licenciatura", label: "Estudiante de licenciatura" }
                        ]
                    }),
                    crearCampoSelect({
                        id: "programa",
                        etiqueta: "Programa académico *",
                        opciones: [
                            { value: "", label: "Selecciona primero tu nivel académico", disabled: true, selected: true }
                        ]
                    }),
                    {
                        tipo: "div",
                        atributos: {
                            class: "campo-registro",
                            id: "campo-programa-personalizado",
                            hidden: true
                        },
                        hijos: [
                            {
                                tipo: "label",
                                atributos: {
                                    class: "etiqueta-campo",
                                    for: "programa-personalizado"
                                },
                                hijos: ["Escribe tu programa *"]
                            },
                            {
                                tipo: "div",
                                atributos: { class: "campo" },
                                hijos: [
                                    { tipo: "i", atributos: { class: "fa-solid fa-graduation-cap" } },
                                    {
                                        tipo: "input",
                                        atributos: {
                                            type: "text",
                                            name: "programa-personalizado",
                                            id: "programa-personalizado",
                                            placeholder: "Escribe tu programa",
                                            autocomplete: "off"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "campo-registro" },
                        hijos: [
                            {
                                tipo: "label",
                                atributos: {
                                    class: "etiqueta-campo",
                                    for: "semestre",
                                    id: "etiqueta-semestre"
                                },
                                hijos: ["Semestre *"]
                            },
                            {
                                tipo: "div",
                                atributos: { class: "fila-select" },
                                hijos: [
                                    {
                                        tipo: "select",
                                        atributos: {
                                            class: "select-preferencia",
                                            name: "semestre",
                                            id: "semestre",
                                            autocomplete: "off",
                                            required: true
                                        },
                                        hijos: [
                                            {
                                                tipo: "option",
                                                atributos: {
                                                    value: "",
                                                    disabled: true,
                                                    selected: true
                                                },
                                                hijos: ["Selecciona primero tu nivel académico"]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tipo: "h3",
                        atributos: { class: "subtitulo-seccion" },
                        hijos: ["Información de acceso"]
                    },
                    crearCampoContrasena({
                        id: "contrasena",
                        etiqueta: "Contraseña *",
                        placeholder: "Mínimo 8 caracteres"
                    }),
                    crearCampoContrasena({
                        id: "confirmar-contrasena",
                        etiqueta: "Confirmar contraseña *",
                        placeholder: "Repite tu contraseña"
                    }),
                    {
                        tipo: "div",
                        atributos: { class: "terminos-registro texto-formulario" },
                        hijos: [
                            { tipo: "span", hijos: ["Al crear la cuenta aceptas los "] },
                            {
                                tipo: "a",
                                atributos: {
                                    href: "#",
                                    class: "enlace-app enlace-terminos"
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (typeof alVerTerminos === "function") {
                                            alVerTerminos();
                                        }
                                    }
                                },
                                hijos: ["términos y condiciones"]
                            }
                        ]
                    },
                    {
                        tipo: "button",
                        atributos: {
                            type: "submit",
                            class: "btn-primario btn-ancho",
                            id: "btn-registro"
                        },
                        hijos: ["Crear cuenta"]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "inicio-sesion texto-formulario" },
                        hijos: [
                            { tipo: "span", hijos: ["¿Ya tienes una cuenta? "] },
                            {
                                tipo: "a",
                                atributos: {
                                    href: "#",
                                    class: "enlace-app enlace-inicio-sesion",
                                    id: "link-inicio-sesion"
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (typeof alIrAInicioSesion === "function") {
                                            alIrAInicioSesion();
                                        }
                                    }
                                },
                                hijos: ["Inicia sesión"]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

function crearCampoTexto({
    id,
    icono,
    etiqueta,
    placeholder,
    autocomplete = "off",
    type = "text",
    required = false
}) {
    return {
        tipo: "div",
        atributos: { class: "campo-registro" },
        hijos: [
            {
                tipo: "label",
                atributos: {
                    class: "etiqueta-campo",
                    for: id
                },
                hijos: [etiqueta]
            },
            {
                tipo: "div",
                atributos: { class: "campo" },
                hijos: [
                    { tipo: "i", atributos: { class: icono } },
                    {
                        tipo: "input",
                        atributos: {
                            type,
                            name: id,
                            id,
                            placeholder,
                            autocomplete,
                            required
                        }
                    }
                ]
            }
        ]
    };
}

function crearCampoContrasena({ id, etiqueta, placeholder }) {
    return {
        tipo: "div",
        atributos: { class: "campo-registro" },
        hijos: [
            {
                tipo: "label",
                atributos: {
                    class: "etiqueta-campo",
                    for: id
                },
                hijos: [etiqueta]
            },
            {
                tipo: "div",
                atributos: { class: "campo-con-boton" },
                hijos: [
                    {
                        tipo: "div",
                        atributos: { class: "campo" },
                        hijos: [
                            { tipo: "i", atributos: { class: "fa-solid fa-lock" } },
                            {
                                tipo: "input",
                                atributos: {
                                    type: "password",
                                    name: id,
                                    id,
                                    placeholder,
                                    autocomplete: "new-password",
                                    minlength: 8,
                                    required: true
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

function crearCampoSelect({ id, etiqueta, opciones }) {
    return {
        tipo: "div",
        atributos: { class: "campo-registro" },
        hijos: [
            {
                tipo: "label",
                atributos: {
                    class: "etiqueta-campo",
                    for: id
                },
                hijos: [etiqueta]
            },
            {
                tipo: "div",
                atributos: { class: "fila-select" },
                hijos: [
                    {
                        tipo: "select",
                        atributos: {
                            class: "select-preferencia",
                            name: id,
                            id,
                            autocomplete: "off",
                            required: true
                        },
                        hijos: opciones.map(({ value, label, disabled = false, selected = false }) => ({
                            tipo: "option",
                            atributos: {
                                value,
                                ...(disabled ? { disabled: true } : {}),
                                ...(selected ? { selected: true } : {})
                            },
                            hijos: [label]
                        }))
                    }
                ]
            }
        ]
    };
}

async function ejecutarRegistro(formulario, registrar) {
    const boton = formulario.querySelector("#btn-registro");
    const textoOriginal = boton?.textContent || "Crear cuenta";

    if (boton) {
        boton.disabled = true;
        boton.textContent = "Creando cuenta...";
    }

    mostrarFeedbackFormulario(formulario, "Estamos creando tu cuenta. Espera un momento.", "info");

    try {
        await registrar();
    } catch (error) {
        const errorRegistro = obtenerMensajeErrorRegistro(error);

        if (errorRegistro.campo) {
            mostrarErroresCampos(formulario, [errorRegistro]);
        } else {
            mostrarFeedbackFormulario(formulario, errorRegistro.mensaje, "error");
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
        errores.push({ campo: "nombre", mensaje: "Escribe un nombre de usuario o apodo." });
    }

    if (!datos.correo?.trim()) {
        errores.push({ campo: "correo", mensaje: "Escribe tu correo electrónico." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
        errores.push({ campo: "correo", mensaje: "Escribe un correo electrónico válido." });
    }

    if (!datos.nivelAcademico?.trim()) {
        errores.push({ campo: "nivel-academico", mensaje: "Selecciona si estudias maestría o licenciatura." });
    }

    if (!datos.programa?.trim()) {
        errores.push({
            campo: datos.programaSeleccionado === "Otro" ? "programa-personalizado" : "programa",
            mensaje: "Selecciona tu programa académico."
        });
    }

    if (!datos.semestre?.trim()) {
        errores.push({
            campo: "semestre",
            mensaje: datos.nivelAcademico === "licenciatura"
                ? "Selecciona tu nivel."
                : "Selecciona tu semestre."
        });
    }

    if (!datos.contrasena || datos.contrasena.length < 8) {
        errores.push({ campo: "contrasena", mensaje: "La contraseña debe tener al menos 8 caracteres." });
    }

    if (datos.contrasena !== datos.confirmarContrasena) {
        errores.push({ campo: "confirmar-contrasena", mensaje: "Las contraseñas no coinciden." });
    }

    if (foto?.size > 0 && !["image/png", "image/jpeg", "image/webp"].includes(foto.type)) {
        errores.push({ campo: "foto-perfil", mensaje: "La foto debe ser PNG, JPG o WEBP. También puedes continuar sin foto." });
    }

    return errores;
}

function mostrarFeedbackFormulario(formulario, mensaje, tipo = "error", campo = "") {
    const feedback = formulario.querySelector("#feedback-registro");
    if (!feedback) return;

    feedback.textContent = mensaje;
    feedback.className = `feedback-formulario feedback-formulario--${tipo}`;
    feedback.classList.remove("oculto");

    if (campo) {
        const control = formulario.querySelector(`[name="${campo}"]`);
        const contenedorCampo = control?.closest(".campo-registro");

        contenedorCampo?.classList.add("campo-registro--error");
        control?.setAttribute("aria-invalid", "true");
        control?.focus();
    }
}

function mostrarErroresCampos(formulario, errores = []) {
    if (!errores.length) return;

    errores.forEach(({ campo, mensaje }) => {
        const control = formulario.querySelector(`[name="${campo}"]`);
        const contenedorCampo = control?.closest(".campo-registro");

        if (!control || !contenedorCampo) {
            mostrarFeedbackFormulario(formulario, mensaje, "error");
            return;
        }

        const idError = `error-${campo}`;
        let mensajeCampo = contenedorCampo.querySelector(`#${idError}`);

        if (!mensajeCampo) {
            mensajeCampo = document.createElement("p");
            mensajeCampo.id = idError;
            mensajeCampo.className = "mensaje-error-campo";
            contenedorCampo.appendChild(mensajeCampo);
        }

        mensajeCampo.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i><span>${mensaje}</span>`;
        contenedorCampo.classList.add("campo-registro--error");
        control.setAttribute("aria-invalid", "true");
        control.setAttribute("aria-describedby", idError);
    });

    const primerCampo = formulario.querySelector('.campo-registro--error [aria-invalid="true"]');
    primerCampo?.focus();
}

function limpiarFeedbackFormulario(formulario) {
    const feedback = formulario.querySelector("#feedback-registro");

    if (!feedback) return;

    feedback.classList.add("oculto");
    feedback.classList.remove("feedback-formulario--error", "feedback-formulario--info", "feedback-formulario--exito");
    feedback.textContent = "";

    formulario.querySelectorAll(".campo-registro--error").forEach((campo) => {
        campo.classList.remove("campo-registro--error");
    });

    formulario.querySelectorAll(".mensaje-error-campo").forEach((mensaje) => {
        mensaje.remove();
    });

    formulario.querySelectorAll('[aria-invalid="true"]').forEach((control) => {
        control.removeAttribute("aria-invalid");
        control.removeAttribute("aria-describedby");
    });
}

function obtenerMensajeErrorRegistro(error) {
    const codigo = error?.code || "";

    const mensajes = {
        "auth/email-already-in-use": { campo: "correo", mensaje: "Este correo ya tiene una cuenta registrada. Puedes iniciar sesión." },
        "auth/invalid-email": { campo: "correo", mensaje: "El correo electrónico no tiene un formato válido." },
        "auth/weak-password": { campo: "contrasena", mensaje: "Usa una contraseña de al menos 8 caracteres." },
        "auth/network-request-failed": { mensaje: "No se pudo conectar con Firebase. Revisa tu conexión e inténtalo de nuevo." },
        "PERMISSION_DENIED": { mensaje: "No se pudieron guardar tus datos de perfil. Revisa las reglas de Firebase e inténtalo de nuevo." }
    };

    return mensajes[codigo] || {
        mensaje: error?.message || "No fue posible crear la cuenta. Revisa los datos e inténtalo de nuevo."
    };
}

function configurarFormularioRegistro() {
    configurarCamposAcademicos();
    configurarLimpiezaErrores();
}

function configurarCamposAcademicos() {
    const selectorNivel = document.querySelector("#nivel-academico");
    const selectorPrograma = document.querySelector("#programa");
    const selectorAvance = document.querySelector("#semestre");
    const etiquetaAvance = document.querySelector("#etiqueta-semestre");
    const campoProgramaPersonalizado = document.querySelector("#campo-programa-personalizado");
    const inputProgramaPersonalizado = document.querySelector("#programa-personalizado");

    if (!selectorNivel || !selectorPrograma || !selectorAvance || !etiquetaAvance || !campoProgramaPersonalizado || !inputProgramaPersonalizado) {
        return;
    }

    const actualizarCampos = () => {
        const configuracion = OPCIONES_ACADEMICAS[selectorNivel.value];

        selectorPrograma.innerHTML = "";
        selectorAvance.innerHTML = "";

        if (!configuracion) {
            selectorPrograma.appendChild(crearOpcionSelect("", "Selecciona primero tu nivel académico", true, true));
            selectorAvance.appendChild(crearOpcionSelect("", "Selecciona primero tu nivel académico", true, true));
            etiquetaAvance.textContent = "Semestre *";
            campoProgramaPersonalizado.hidden = true;
            inputProgramaPersonalizado.required = false;
            inputProgramaPersonalizado.value = "";
            return;
        }

        etiquetaAvance.textContent = configuracion.avanceEtiqueta;
        selectorPrograma.appendChild(crearOpcionSelect("", "Selecciona tu programa", true, true));
        configuracion.programas.forEach((programa) => {
            selectorPrograma.appendChild(crearOpcionSelect(programa, programa));
        });

        selectorAvance.appendChild(crearOpcionSelect("", configuracion.avancePlaceholder, true, true));
        configuracion.avances.forEach((avance) => {
            selectorAvance.appendChild(crearOpcionSelect(avance, avance));
        });

        selectorPrograma.value = "";
        selectorAvance.value = "";
        campoProgramaPersonalizado.hidden = true;
        inputProgramaPersonalizado.required = false;
        inputProgramaPersonalizado.value = "";
    };

    selectorNivel.addEventListener("change", actualizarCampos);
    selectorPrograma.addEventListener("change", () => {
        const usaOtro = selectorPrograma.value === "Otro";
        campoProgramaPersonalizado.hidden = !usaOtro;
        inputProgramaPersonalizado.required = usaOtro;
        if (!usaOtro) {
            inputProgramaPersonalizado.value = "";
        }
    });

    actualizarCampos();
}

function crearOpcionSelect(value, label, disabled = false, selected = false) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.disabled = disabled;
    option.selected = selected;
    return option;
}

function configurarLimpiezaErrores() {
    const formulario = document.querySelector("#form-registro");
    if (!formulario) return;

    formulario.querySelectorAll("input, select").forEach((control) => {
        control.addEventListener("input", () => limpiarErrorCampo(control));
        control.addEventListener("change", () => limpiarErrorCampo(control));
    });
}

function limpiarErrorCampo(control) {
    const contenedorCampo = control?.closest(".campo-registro");
    if (!contenedorCampo) return;

    contenedorCampo.classList.remove("campo-registro--error");
    contenedorCampo.querySelector(".mensaje-error-campo")?.remove();
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-describedby");
}

function resolverProgramaRegistro(programaSeleccionado, programaPersonalizado) {
    if (programaSeleccionado === "Otro") {
        return programaPersonalizado?.trim() || "";
    }

    return programaSeleccionado?.trim() || "";
}
