import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { activarOverlay, desactivarOverlay } from "../../servicios/overlay.js";

export function mostrarTutorialActividad({ id, titulo, descripcion, pasos = [], textoBoton = "Entendido", alCerrar = null } = {}) {
    if (!id) return null;

    const tutorialAnterior = document.getElementById("tutorial-actividad");
    tutorialAnterior?.remove();
    desactivarOverlay("tutorial-actividad");
    const claseActividad = obtenerClaseTutorial(id);

    const tutorial = construirElemento({
        tipo: "div",
        atributos: {
            id: "tutorial-actividad",
            class: `tutorial-actividad ${claseActividad}`,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "tutorial-actividad-titulo"
        },
        hijos: [
            {
                tipo: "div",
                atributos: { class: "tutorial-actividad__tarjeta" },
                hijos: [
                    { tipo: "h2", atributos: { id: "tutorial-actividad-titulo" }, hijos: [titulo || "Guía rápida"] },
                    descripcion ? { tipo: "p", hijos: [descripcion] } : null,
                    {
                        tipo: "ul",
                        atributos: { class: "tutorial-actividad__lista" },
                        hijos: pasos.map((paso) => ({
                            tipo: "li",
                            hijos: [
                                { tipo: "i", atributos: { class: paso.icono || "fa-solid fa-circle-info" } },
                                { tipo: "span", hijos: [paso.texto] }
                            ]
                        }))
                    },
                    {
                        tipo: "button",
                        atributos: { type: "button", class: "btn-actividad-salir tutorial-actividad__accion" },
                        hijos: [textoBoton]
                    }
                ]
            }
        ]
    });

    tutorial.montar(document.body);
    activarOverlay("tutorial-actividad");
    tutorial.nodo.querySelector(".tutorial-actividad__cerrar")?.remove();

    let cerrado = false;
    const cerrar = () => {
        if (cerrado) return;
        cerrado = true;
        tutorial.nodo?.remove();
        desactivarOverlay("tutorial-actividad");
        if (typeof alCerrar === "function") alCerrar();
    };

    tutorial.nodo.addEventListener("click", (evento) => {
        if (evento.target.closest(".tutorial-actividad__accion")) {
            cerrar();
            return;
        }

        if (evento.target === tutorial.nodo) cerrar();
    });

    return tutorial.nodo;
}

function obtenerClaseTutorial(id) {
    const clases = {
        tablero: "tutorial-actividad--tablero",
        "pizarron-creativo": "tutorial-actividad--pizarron",
        "juego-flores": "tutorial-actividad--juego",
        "respiracion-guiada": "tutorial-actividad--respiracion"
    };

    return clases[id] || "tutorial-actividad--general";
}
