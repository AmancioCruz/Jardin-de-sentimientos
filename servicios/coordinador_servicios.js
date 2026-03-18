import { subirImagen } from "./almacenamiento.js";
import { RegistrarUsuarioAuth } from "./autenticacion.js";
import { registrarDatosUsuario } from "./base_datos.js";

export async function registrarUsuario(datosUsuario) {
    const { foto, nombre, correo, programa, semestre, contraseña, sonido, tema, terminos } = datosUsuario;

    try {

        //registramos al usuairo y nos da el user uid
        const uid = await RegistrarUsuarioAuth(correo, contraseña);

        //subimos la foto de perfil a storage, se crea la carpeta con el user uid
        const extension = foto.name.split('.').pop(); 
        await subirImagen(`usuarios/${uid}/perfil.${extension}`, foto);

        //registramos al usuario con todos sus datos
        await registrarDatosUsuario(uid, {
            nombre: nombre,
            correo: correo,
            programa: programa,
            semestre: semestre,
            configuraciones: {
                sonido: sonido,
                tema: tema
            },
            terminos: terminos
        })
    } catch (error) {
        console.error('Error registro de usuario:', error.message);
        throw error;
    }
}