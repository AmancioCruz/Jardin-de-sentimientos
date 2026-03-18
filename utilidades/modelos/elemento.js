export class Elemento {
    constructor(tipo, atributos = {}, hijos = []) {
        this.tipo = tipo;
        this.atributos = atributos;
        this.hijos = [];
        this.nodo = null;
        this.eventListeners = new Map();

        const claseActual = this.atributos.class || '';
        this.atributos.class = claseActual ? `${claseActual} animado` : 'animado';

        hijos.forEach(hijo => this.agregarHijo(hijo));
    }

    agregarHijo(hijo) {
        if (hijo instanceof Elemento) {
            this.hijos.push(hijo);
            if (this.nodo) this.nodo.appendChild(hijo.construir());
        } else if (hijo instanceof HTMLElement || hijo instanceof Text) {
            this.hijos.push(hijo);
            if (this.nodo) this.nodo.appendChild(hijo);
        } else if (typeof hijo === 'string' || typeof hijo === 'number') {
            const textNode = document.createTextNode(String(hijo));
            this.hijos.push(textNode);
            if (this.nodo) this.nodo.appendChild(textNode);
        } else {
            console.warn('Tipo de hijo no soportado:', hijo);
        }
        return this;
    }

    construir() {
        if (this.nodo) {
            this.limpiarEventos();
            this.nodo.innerHTML = '';
        } else {
            this.nodo = crearElementoDOM(this.tipo, this.atributos, this);
        }

        this.hijos.forEach(hijo => {
            if (hijo instanceof Elemento) {
                this.nodo.appendChild(hijo.construir());
            } else {
                this.nodo.appendChild(hijo);
            }
        });

        return this.nodo;
    }

    montar(destino, limpiar = false) {
        const contenedor = typeof destino === 'string'
            ? document.querySelector(destino)
            : destino;

        if (!contenedor) throw new Error(`Destino no encontrado: ${destino}`);

        if (limpiar) contenedor.innerHTML = '';

        this.construir();
        contenedor.appendChild(this.nodo);

        return this;
    }

    registrarEvento(elemento, tipo, handler) {
        if (!this.eventListeners.has(elemento)) {
            this.eventListeners.set(elemento, []);
        }
        this.eventListeners.get(elemento).push({ tipo, handler });
    }

    limpiarEventos() {
        this.eventListeners.forEach((listeners, elemento) => {
            listeners.forEach(({ tipo, handler }) => {
                elemento.removeEventListener(tipo, handler);
            });
        });
        this.eventListeners.clear();
    }
}


function crearElementoDOM(tag, atributos = {}, elementoRef = null) {
    const elemento = document.createElement(tag);

    Object.entries(atributos).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === 'class' || key === 'className') {
            if (typeof value === 'string') {
                value.split(' ').filter(Boolean).forEach(c => elemento.classList.add(c));
            } else if (Array.isArray(value)) {
                elemento.classList.add(...value);
            }
        }
        else if (key === 'style' && typeof value === 'object') {
            Object.assign(elemento.style, value);
        }
        else if (key.startsWith('data-')) {
            elemento.setAttribute(key, value);
        }
        else if (key.startsWith('on') && typeof value === 'function') {
            const evento = key.slice(2).toLowerCase();
            elemento.addEventListener(evento, value);
            if (elementoRef) elementoRef.registrarEvento(elemento, evento, value);
        }
        else if (typeof value === 'boolean') {
            if (value) elemento.setAttribute(key, '');
            else elemento.removeAttribute(key);
            elemento[key] = value;
        }
        else {
            elemento.setAttribute(key, value);
            if (key in elemento) elemento[key] = value;
        }
    });

    return elemento;
}

