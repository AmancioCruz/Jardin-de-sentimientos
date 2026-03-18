export function mostrarJardin(nombreUsuario, alEvaluarRapida, alEvaluarCompleta) {
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
                hijos: ["Jardin"]
            },
        
        ]
    });
}



/*
<canvas id="pizarra" class="pizarra-lienzo"></canvas>
            <div id="contenedor-pizarra" class="pizarra-contenedor">
                

                <div class="pizarra-herramientas">
                    <button class="btn-herramienta btn-pincel activo" data-tool="pincel">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="btn-herramienta btn-borrador" data-tool="borrador">
                        <i class="fa-solid fa-eraser"></i>
                    </button>

                    <input type="color" class="input-color" value="#164E3F">

                    <input type="range" class="input-grosor" min="1" max="20" value="3">

                    <label class="btn-subir">
                        <i class="fa-solid fa-image"></i>
                        <input type="file" class="input-imagen" accept="image/*">
                    </label>

                    <button class="btn-limpiar">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                    <button class="btn-guardar">
                        <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                </div>
            </div>
 */