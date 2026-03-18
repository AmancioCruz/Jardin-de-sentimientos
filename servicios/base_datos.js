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