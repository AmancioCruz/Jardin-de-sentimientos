import { construirElemento } from "../../../utilidades/constructor_elementos.js";

export function crearInicioSesion({ alEnviar, alIrARegistro }) {
    return construirElemento({
        tipo: "div",
        atributos: {
            id: "contenedor-inicio-sesion"
        },
        hijos: [
            {
                tipo: "form",
                atributos: {
                    class: "formulario-app tarjeta-app tarjeta-app--elevada formulario-inicio-sesion",
                    id: "form-inicio-sesion"
                },
                eventos: {
                    submit: async (e) => {
                        e.preventDefault();
                        const formulario = e.currentTarget;
                        const mensajeError = formulario.querySelector("[data-error-inicio-sesion]");
                        const formData = new FormData(e.target);
                        const datos = {
                            correo: formData.get("correo"),
                            contrasena: formData.get("contrasena")
                        };

                        ocultarErrorLogin(mensajeError);

                        if (alEnviar && typeof alEnviar === "function") {
                            try {
                                await alEnviar(datos);
                            } catch (error) {
                                mostrarErrorLogin(
                                    mensajeError,
                                    error?.message || "No fue posible iniciar sesión. Revisa tu correo y contraseña."
                                );
                            }
                        }
                    },
                    input: (e) => {
                        ocultarErrorLogin(e.currentTarget.querySelector("[data-error-inicio-sesion]"));
                    }
                },
                hijos: [
                    {
                        tipo: "h2",
                        atributos: { class: "titulo-formulario" },
                        hijos: ["Iniciar sesión"]
                    },
                    {
                        tipo: "p",
                        atributos: {
                            class: "mensaje-error-formulario oculto",
                            "data-error-inicio-sesion": "",
                            role: "alert"
                        },
                        hijos: [""]
                    },
                    crearCampoLogin({
                        etiqueta: "Correo",
                        icono: "fa-solid fa-envelope",
                        input: {
                            type: "email",
                            name: "correo",
                            id: "correo",
                            placeholder: "Correo electrónico",
                            required: true
                        }
                    }),
                    crearCampoLogin({
                        etiqueta: "Contraseña",
                        icono: "fa-solid fa-lock",
                        input: {
                            type: "password",
                            name: "contrasena",
                            id: "contrasena",
                            placeholder: "Contraseña",
                            required: true
                        }
                    }),
                    {
                        tipo: "button",
                        atributos: {
                            type: "submit",
                            class: "btn-primario btn-ancho"
                        },
                        hijos: ["Entrar"]
                    },
                    {
                        tipo: "div",
                        atributos: { class: "registro texto-formulario" },
                        hijos: [
                            { tipo: "span", hijos: ["¿No tienes cuenta? "] },
                            {
                                tipo: "a",
                                atributos: {
                                    href: "#",
                                    class: "enlace-app enlace-registro",
                                    id: "link-registro"
                                },
                                eventos: {
                                    click: (e) => {
                                        e.preventDefault();
                                        if (alIrARegistro && typeof alIrARegistro === "function") {
                                            alIrARegistro();
                                        }
                                    }
                                },
                                hijos: ["Regístrate"]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

function crearCampoLogin({ etiqueta, icono, input }) {
    return {
        tipo: "div",
        atributos: { class: "grupo-campo grupo-campo--inicio-sesion" },
        hijos: [
            {
                tipo: "label",
                atributos: {
                    class: "etiqueta-campo",
                    for: input.id
                },
                hijos: [etiqueta]
            },
            {
                tipo: "div",
                atributos: { class: "campo campo--inicio-sesion" },
                hijos: [
                    { tipo: "i", atributos: { class: icono } },
                    {
                        tipo: "input",
                        atributos: input
                    }
                ]
            }
        ]
    };
}

function mostrarErrorLogin(nodo, mensaje) {
    if (!nodo) return;

    nodo.textContent = mensaje;
    nodo.classList.remove("oculto");
}

function ocultarErrorLogin(nodo) {
    if (!nodo) return;

    nodo.textContent = "";
    nodo.classList.add("oculto");
}
