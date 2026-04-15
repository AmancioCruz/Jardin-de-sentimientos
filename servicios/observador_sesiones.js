import { configuracionesFirebase } from "./firebase_config.js";
import { onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { obtenerDatosUsuario } from "./base_datos.js";
import { obtenerFotoPerfil } from "./almacenamiento.js";
import { Usuario } from "../utilidades/modelos/usuario.js";


export function haySesionActiva() {
    return new Promise((resolve, reject) => {
        let dejarDeObservar = () => {};

        dejarDeObservar = onAuthStateChanged(configuracionesFirebase.auth, async (usuarioFirebase) => {
            dejarDeObservar();

            if (usuarioFirebase) {
                try {
                    const usuario = await construirUsuario(usuarioFirebase);
                    resolve(usuario);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(null);
            }
        });
    });
}

export async function construirUsuario(usuarioFirebase) {
    const [perfil, foto] = await Promise.all([
        obtenerDatosUsuario(usuarioFirebase),
        obtenerFotoPerfil(usuarioFirebase)
    ]);

    return new Usuario(
        usuarioFirebase.uid,
        perfil?.nombre || '',
        usuarioFirebase.email,
        foto,
        perfil?.programa || '',
        perfil?.semestre || 1
    );
}
