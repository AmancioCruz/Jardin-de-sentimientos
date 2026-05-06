import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { crearBloqueInformacion } from "../perfil/perfil.js";
import { mostrarBitacora } from "../bitacora/bitacora.js";

export function crearMiEspacio({ usuario } = {}) {
    const bitacora = mostrarBitacora({ usuario, mostrarEncabezado: false });
    const nombreUsuario = usuario?.nombre || "Sin nombre";

    return construirElemento({
        tipo: "section",
        atributos: { class: "mi-espacio" },
        hijos: [
            {
                tipo: "header",
                atributos: { class: "mi-espacio__encabezado" },
                hijos: [
                    { tipo: "p", atributos: { class: "etiqueta-pantalla etiqueta-pantalla--espacio" }, hijos: ["Mi espacio"] },
                    {
                        tipo: "div",
                        atributos: { class: "mi-espacio__titulo-linea" },
                        hijos: [
                            {
                                tipo: "h1",
                                atributos: { class: "titulo-seccion-app" },
                                hijos: [`${nombreUsuario}, este es tu espacio`]
                            }
                        ]
                    }
                ]
            },
            crearBloqueInformacion(usuario),
            {
                tipo: "section",
                atributos: { class: "mi-espacio__bitacora" },
                hijos: [bitacora]
            }
        ]
    });
}
