import { configuracionesFirebase } from "./firebase_config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

export async function obtenerDatosUsuario(usuario) {
    try {
        const referencia = ref(configuracionesFirebase.basedatos, `usuarios/${usuario.uid}`);
        const resultado = await get(referencia);

        if (resultado.exists()) {
            return resultado.val();
        }

        return null;
    } catch (error) {
        /* Si la base niega lectura devolvemos null para no romper el armado del usuario.
           Asi la app puede seguir mostrando la sesion aunque falte informacion opcional. */
        if (error?.code === "PERMISSION_DENIED") {
            console.warn(`Sin permisos para leer usuarios/${usuario.uid} en Realtime Database.`);
            return null;
        }

        console.error("Error al obtener los datos del usuario:", error);
        throw error;
    }
}

export async function registrarDatosUsuario(uid, datos) {
    try {
        const referencia = ref(configuracionesFirebase.basedatos, `usuarios/${uid}`);
        const fecha = new Date().toISOString().split("T")[0];

        await set(referencia, {
            ...datos,
            creado: fecha
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
}
