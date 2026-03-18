import { configuracionesFirebase } from "./firebase_config.js"
import { ref, set, get, child, onValue }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export async function obtenerDatosUsuario(usuario) {
    const referencia = ref(configuracionesFirebase.basedatos, 'usuarios/' + usuario.uid);

    const resultado = await get(referencia);

    if (resultado.exists()) {
        const userData = resultado.val();
        return userData;
    } else {
        console.log("No se encontraron datos para este usuario.");
        return null;
    }
}

export async function registrarDatosUsuario(uid, datos) {
    try {
        const referencia = ref(configuracionesFirebase.basedatos, `usuarios/${uid}`);
        const fecha = new Date();

        const formato = fecha.toISOString().split("T")[0];
        await set(referencia, {
            ...datos,
            creado: formato
        });
        console.log('Usuario registrado:', uid);
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
}