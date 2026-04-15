import { ref, listAll, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";
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

export async function subirImagenActividad(usuario, nombreActividad, canvas, fechaActividad = new Date()) {
    const uid = typeof usuario === 'string' ? usuario : usuario?.uid;

    if (!uid) {
        throw new Error("No se recibio el uid del usuario para guardar la actividad.");
    }

    if (!canvas) {
        throw new Error("No se recibio una imagen valida para guardar la actividad.");
    }

    const nombreArchivo = `${normalizarNombreActividad(nombreActividad)}_${crearMarcaFechaHora(fechaActividad)}.jpg`;
    const ruta = `usuarios/${uid}/actividades/${nombreArchivo}`;
    const imagen = await convertirCanvasAJpeg(canvas);
    const referencia = ref(configuracionesFirebase.storage, ruta);

    await uploadBytes(referencia, imagen, { contentType: "image/jpeg" });

    return {
        nombre: nombreArchivo,
        ruta,
        url: await getDownloadURL(referencia)
    };
}

function convertirCanvasAJpeg(canvas) {
    return new Promise((resolve, reject) => {
        const lienzo = document.createElement("canvas");
        const contexto = lienzo.getContext("2d");

        lienzo.width = canvas.width;
        lienzo.height = canvas.height;
        contexto.fillStyle = "#fffef9";
        contexto.fillRect(0, 0, lienzo.width, lienzo.height);
        contexto.drawImage(canvas, 0, 0);

        lienzo.toBlob((blob) => {
            if (!blob) {
                reject(new Error("No se pudo convertir el canvas a imagen."));
                return;
            }

            resolve(blob);
        }, "image/jpeg", 0.92);
    });
}

function crearMarcaFechaHora(fecha = new Date()) {
    const pad = (valor) => String(valor).padStart(2, "0");

    return [
        fecha.getFullYear(),
        pad(fecha.getMonth() + 1),
        pad(fecha.getDate())
    ].join("-") + "_" + [
        pad(fecha.getHours()),
        pad(fecha.getMinutes()),
        pad(fecha.getSeconds())
    ].join("-");
}

function normalizarNombreActividad(nombreActividad = "actividad") {
    return String(nombreActividad)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "actividad";
}
