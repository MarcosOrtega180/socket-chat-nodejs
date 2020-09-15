class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {id, nombre, sala};
        this.personas.push(persona);
        return persona;
    }

    getPersona(id) {
        return this.personas.filter(persona => persona.id === id)[0];
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let lista= this.personas.filter(persona=>persona.sala===sala);
        console.log('lista',lista);
        return lista;
    }

    borrarPersona(id) {
        //esta es la última persona en ser eliminada
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id != id);
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}