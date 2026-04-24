import { subirImagen } from "./almacenamiento.js";
import { EliminarUsuarioAuth, RegistrarUsuarioAuth } from "./autenticacion.js";
import { registrarDatosUsuario } from "./base_datos.js";

export async function registrarUsuario(datosUsuario) {
    const { foto, nombre, correo, nivelAcademico, programa, semestre, terminos, contrasena } = datosUsuario;
    let usuarioAuth = null;

    try {
        usuarioAuth = await RegistrarUsuarioAuth(correo, contrasena);
        const uid = usuarioAuth?.uid;
        if (!uid || typeof uid !== "string") {
            throw new Error("No se pudo obtener un UID valido para el usuario.");
        }

        await registrarDatosUsuario(uid, {
            nombre,
            correo,
            nivelAcademico,
            programa,
            semestre,
            terminos
        });

        if (foto?.size > 0 && ["image/png", "image/jpeg", "image/webp"].includes(foto.type)) {
            const extension = foto.name.split('.').pop();
            await subirImagen(`usuarios/${uid}/perfil.${extension}`, foto);
        }

        return usuarioAuth;
    } catch (error) {
        if (usuarioAuth) {
            await EliminarUsuarioAuth(usuarioAuth).catch((errorEliminacion) => {
                console.warn("No se pudo revertir la cuenta creada:", errorEliminacion.message);
            });
        }

        console.error('Error registro de usuario:', error.message);
        throw error;
    }
}
