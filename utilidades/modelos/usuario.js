export class Usuario {
    #uid;
    #nombre;
    #correo;
    #urlImagen;
    #programa;
    #semestre;

    constructor(uid, nombre, correo, urlImagen, programa, semestre) {
        this.#uid = uid;
        this.#nombre = nombre;
        this.#correo = correo;
        this.#urlImagen = urlImagen || 'default-avatar.png';
        this.#programa = programa;
        this.#semestre = semestre;
    }

    get uid() { return this.#uid; }
    get nombre() { return this.#nombre; }
    get correo() { return this.#correo; }
    get urlImagen() { return this.#urlImagen; }
    get programa() { return this.#programa; }
    get semestre() { return this.#semestre; }

    set urlImagen(url) { this.#urlImagen = url; }

    get datosCompletos() {
        return {
            uid: this.#uid,
            nombre: this.#nombre,
            correo: this.#correo,
            urlImagen: this.#urlImagen,
            programa: this.#programa,
            semestre: this.#semestre
        };
    }
}
