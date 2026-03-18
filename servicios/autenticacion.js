import { configuracionesFirebase } from './firebase_config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

export const IniciarSesionAuth = async (correo, contra) => {
    try {
        const credenciales = await signInWithEmailAndPassword(configuracionesFirebase.auth, correo, contra);
        const usuario = credenciales.user;
        return usuario;
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        throw error;
    }
};

export const CerrarSesionAuth = async () => {
    try {
        await signOut(configuracionesFirebase.auth);
        console.log("Sesión cerrada");
        location.reload();
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
        throw error;
    }
};