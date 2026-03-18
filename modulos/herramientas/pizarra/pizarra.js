export function mostrarPizarra(nombreUsuario, alEvaluarRapida, alEvaluarCompleta) {
    return construirElemento({
        tipo: 'div',
        atributos: {
            id: 'contenedor-jardin',
            class: 'jardin-contenedor'
        },
        hijos: [
            {
                tipo: 'h1',
                atributos: { class: 'inicio-saludo' },
                hijos: ["Pizarra"]
            },
        
        ]
    });
}
