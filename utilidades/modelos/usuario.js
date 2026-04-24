export class Usuario {
    #uid;
    #nombre;
    #correo;
    #urlImagen;
    #nivelAcademico;
    #programa;
    #semestre;

    constructor(uid, nombre, correo, urlImagen, programa, semestre, nivelAcademico = "") {
        this.#uid = uid;
        this.#nombre = nombre;
        this.#correo = correo;
        this.#urlImagen = urlImagen || './recursos/imagenes/default.webp';
        this.#nivelAcademico = nivelAcademico;
        this.#programa = programa;
        this.#semestre = semestre;
    }

    get uid() { return this.#uid; }
    get nombre() { return this.#nombre; }
    get correo() { return this.#correo; }
    get urlImagen() { return this.#urlImagen; }
    get nivelAcademico() { return this.#nivelAcademico; }
    get programa() { return this.#programa; }
    get semestre() { return this.#semestre; }

    set urlImagen(url) { this.#urlImagen = url; }

    get datosCompletos() {
        return {
            uid: this.#uid,
            nombre: this.#nombre,
            correo: this.#correo,
            urlImagen: this.#urlImagen,
            nivelAcademico: this.#nivelAcademico,
            programa: this.#programa,
            semestre: this.#semestre
        };
    }
}
