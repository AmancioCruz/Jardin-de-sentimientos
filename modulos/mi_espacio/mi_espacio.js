import { construirElemento } from "../../utilidades/constructor_elementos.js";
import { crearBloqueInformacion } from "../perfil/perfil.js";
import { mostrarBitacora } from "../bitacora/bitacora.js";

export function crearMiEspacio({ usuario } = {}) {
    const bitacora = mostrarBitacora({ usuario, mostrarEncabezado: false });

    return construirElemento({
        tipo: "section",
        atributos: { class: "mi-espacio" },
        hijos: [
            {
                tipo: "header",
                atributos: { class: "mi-espacio__encabezado" },
                hijos: [
                    { tipo: "p", atributos: { class: "etiqueta-pantalla etiqueta-pantalla--espacio" }, hijos: ["Mi espacio"] },
                    { tipo: "h1", atributos: { class: "titulo-seccion-app" }, hijos: ["Tu espacio"] }
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
