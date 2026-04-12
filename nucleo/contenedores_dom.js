export const contenedores = {
    principal: document.querySelector("#contenedor-principal"),
    contenido: document.querySelector("#contenedor-contenido"),
    cabecera: document.querySelector("#cabecera-principal")
};

export function verificarContenedores() {
    const faltantes = [];

    if (!contenedores.principal) faltantes.push('#contenedor-principal');
    if (!contenedores.contenido) faltantes.push('#contenedor-contenido');
    if (!contenedores.cabecera) faltantes.push('#cabecera-principal');

    if (faltantes.length > 0) {
        console.error('Faltan contenedores en el HTML:', faltantes.join(', '));
        return false;
    }

    return true;
}
