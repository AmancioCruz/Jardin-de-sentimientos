import { configuracionesFirebase } from "./firebase_config.js";
import { ref, set, get, push } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

export async function obtenerDatosUsuario(usuario) {
    try {
        const referencia = ref(configuracionesFirebase.basedatos, `usuarios/${usuario.uid}`);
        const resultado = await get(referencia);

        if (resultado.exists()) {
            return resultado.val();
        }

        return null;
    } catch (error) {
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

export async function registrarActividadUsuario(uid, datosActividad) {
    try {
        if (!uid) {
            throw new Error("No se recibio el uid del usuario para registrar la actividad.");
        }

        const referenciaLista = ref(configuracionesFirebase.basedatos, `usuarios/${uid}/actividades`);
        const referenciaActividad = push(referenciaLista);

        await set(referenciaActividad, {
            uid,
            ...datosActividad
        });

        return referenciaActividad.key;
    } catch (error) {
        console.error("Error al registrar la actividad:", error);
        throw error;
    }
}

export async function obtenerActividadesUsuario(uid) {
    try {
        if (!uid) return [];

        const referencia = ref(configuracionesFirebase.basedatos, `usuarios/${uid}/actividades`);
        const resultado = await get(referencia);

        if (!resultado.exists()) return [];

        return Object.entries(resultado.val())
            .map(([id, actividad]) => ({ id, ...actividad }))
            .sort((actividadA, actividadB) => (actividadB.creadoEn || 0) - (actividadA.creadoEn || 0));
    } catch (error) {
        console.error("Error al obtener actividades del usuario:", error);
        return [];
    }
}
