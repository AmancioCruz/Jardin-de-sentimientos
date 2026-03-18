export class Usuario {
    #uid;
    #nombre;
    #correo;
    #urlImagen;
    #programa;
    #semestre;
    #configuraciones;

    constructor(uid, nombre, correo, urlImagen, programa, semestre, configuraciones) {
        this.#uid = uid;
        this.#nombre = nombre;
        this.#correo = correo;
        this.#urlImagen = urlImagen || 'default-avatar.png';
        this.#programa = programa;
        this.#semestre = semestre;
        this.#configuraciones = configuraciones || {
            sonido: 'lluvia',
            tema: 'claro'
        };
    }

    get uid() { return this.#uid; }
    get nombre() { return this.#nombre; }
    get correo() { return this.#correo; }
    get urlImagen() { return this.#urlImagen; }
    get programa() { return this.#programa; }
    get semestre() { return this.#semestre; }
    get configuraciones() { return { ...this.#configuraciones }; }

    set urlImagen(url) { this.#urlImagen = url; }
    
    actualizarConfig(key, valor) {
        this.#configuraciones[key] = valor;
    }

    get datosCompletos() {
        return {
            uid: this.#uid,
            nombre: this.#nombre,
            correo: this.#correo,
            urlImagen: this.#urlImagen,
            programa: this.#programa,
            semestre: this.#semestre,
            configuraciones: { ...this.#configuraciones }
        };
    }
}