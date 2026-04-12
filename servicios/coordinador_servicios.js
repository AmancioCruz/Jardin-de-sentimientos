import { subirImagen } from "./almacenamiento.js";
import { RegistrarUsuarioAuth } from "./autenticacion.js";
import { registrarDatosUsuario } from "./base_datos.js";

export async function registrarUsuario(datosUsuario) {
    const { foto, nombre, correo, programa, semestre, sonido, tema, terminos, contrasena } = datosUsuario;

    try {
        /* Este flujo crea primero la cuenta en Auth.
           Con el uid resultante se guarda foto y despues el perfil completo en la base. */
        const uid = await RegistrarUsuarioAuth(correo, contrasena);
        if (!uid || typeof uid !== "string") {
            throw new Error("No se pudo obtener un UID valido para el usuario.");
        }

        const extension = foto.name.split('.').pop();
        await subirImagen(`usuarios/${uid}/perfil.${extension}`, foto);

        await registrarDatosUsuario(uid, {
            nombre,
            correo,
            programa,
            semestre,
            configuraciones: {
                sonido,
                tema
            },
            terminos
        });

        return uid;
    } catch (error) {
        console.error('Error registro de usuario:', error.message);
        throw error;
    }
}
