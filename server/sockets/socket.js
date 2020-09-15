const {io} = require('../server');
const {Usuarios} = require('../clases/usuarios')
const usuarios = new Usuarios();
const {crearMensaje} = require('../utilidades/utilidades')

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        console.log('Usuario conectado', data);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            });
        }
        client.join(data.sala);
        let usuario = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        console.log('Lista de usuarios', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} ingresó al chat`));
        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('crearMensaje', (data,callback) => {
        let usuario = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(usuario.nombre, data.mensaje);
        client.broadcast.to(data.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        console.log('esteee')
        // client.broadcast.emit('crearMensaje', {
        //     usuario: 'Administrador',
        //     mensaje: `${personaBorrada.nombre} abandonó el chat`
        // });
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });
    //Mensajes privados
    client.on('mensajePrivado', data => {
        let usuario = usuarios.getPersona(client.id);
        //aquí yo especiífico en data.para a quén quiero mandarle el mensaje
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(usuario.nombre, data.mensaje));
    });
});