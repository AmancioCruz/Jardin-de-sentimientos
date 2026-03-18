import { ref, listAll, getDownloadURL, uploadBytes, getBytes } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";
import { configuracionesFirebase } from "./firebase_config.js";

export async function obtenerFotoPerfil(usuario) {
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

export async function subirImagen(ruta, archivo) {
    try {
        const referencia = ref(configuracionesFirebase.storage, ruta);

        const metadata = archivo.type ? { contentType: archivo.type } : {};

        await uploadBytes(referencia, archivo, metadata);

        const url = await getDownloadURL(referencia);

        return url;

    } catch (error) {
        console.error("Error al subir imagen:", error.message);
        throw error;
    }
}

export async function existeCarpeta(ruta) {
    try {
        const referencia = ref(configuracionesFirebase.storage, ruta);
        const resultado = await listAll(referencia);
        return true;

    } catch (error) {
        return false;
    }
}

export async function listarArchivos(ruta) {
    try {
        const referencia = ref(configuracionesFirebase.storage, ruta);
        const resultado = await listAll(referencia);

        const archivos = await Promise.all(
            resultado.items.map(async (item) => ({
                nombre: item.name,
                ruta: item.fullPath,
                url: await getDownloadURL(item)
            }))
        );

        return archivos;

    } catch (error) {
        console.error("Error al listar:", error.message);
        throw error;
    }
}
