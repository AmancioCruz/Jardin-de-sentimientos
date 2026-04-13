import { configuracionesFirebase } from './firebase_config.js';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js';

export const IniciarSesionAuth = async (correo, contra) => {
    try {
        const credenciales = await signInWithEmailAndPassword(configuracionesFirebase.auth, correo, contra);
        return credenciales.user;
    } catch (error) {
        console.error("Error al iniciar sesion:", error.message);
        throw error;
    }
};

export const RegistrarUsuarioAuth = async (correo, contra) => {
    try {
        const credencialesUsuario = await createUserWithEmailAndPassword(
            configuracionesFirebase.auth, correo, contra
        );
        return credencialesUsuario.user;
    } catch (error) {
        console.error("Error al registrar usuario:", error.message);
        throw error;
    }
};

export const EliminarUsuarioAuth = async (usuario) => {
    try {
        if (usuario) await deleteUser(usuario);
    } catch (error) {
        console.error("Error al eliminar usuario:", error.message);
        throw error;
    }
};

export const CerrarSesionAuth = async () => {
    try {
        /* Solo cerramos la sesion en Firebase.
           La limpieza visual y el reload quedan en el gestor que controla la interfaz. */
        await signOut(configuracionesFirebase.auth);
    } catch (error) {
        console.error("Error al cerrar sesion:", error.message);
        throw error;
    }
};
