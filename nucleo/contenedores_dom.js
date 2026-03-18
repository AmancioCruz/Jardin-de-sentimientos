export const contenedores = {
    principal: document.querySelector("#contenedor-principal"),
    contenido: document.querySelector("#contenedor-contenido"),
    cabecera: document.querySelector("#cabecera-principal")
};

/**
 * Verifica que todos los contenedores existan en el HTML
 * @returns {boolean} true si todos existen, false si falta alguno
 */
export function verificarContenedores() {
    const faltantes = [];

    if (!contenedores.principal) faltantes.push('#contenedor-principal');
    if (!contenedores.contenido) faltantes.push('#contenedor-contenido');
    if (!contenedores.cabecera) faltantes.push('#cabecera-principal');

    if (faltantes.length > 0) {
        console.error('Faltan contenedores en el HTML:', faltantes.join(', '));
        return false;
    }

    console.log('Todos los contenedores encontrados');
    return true;
}