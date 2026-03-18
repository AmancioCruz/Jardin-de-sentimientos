import { ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";
import { configuracionesFirebase } from "./firebase_config.js";

export async function  obtenerFotoPerfil(usuario) {
    try {
        const carpetaRef = ref(configuracionesFirebase.storage, `usuarios/${usuario.uid}`);

        const listaResultados = await listAll(carpetaRef);

        for (const itemRef of listaResultados.items) {
            const url = await getDownloadURL(itemRef);
            return url
        }

    } catch (error) {
        console.error("Error al listar o obtener imágenes en la carpeta:", error);
        return null; 
    }
}