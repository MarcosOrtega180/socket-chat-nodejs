var socket = io();
var params = new URLSearchParams(window.location.search);
if(!params.has('nombre') || !params.has('sala')){
    window.location ='index.html';
    throw new Error('El nombre y la sala son necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}


socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat',usuario,function (resp){
        console.log('usuarios conectados', resp);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log(`Servidor:`);
    console.log(mensaje);
});

//cuando un usuario entra o sle del chat
socket.on('listaPersonas', function(personas) {
    console.log('Lista de personas:\n');
    console.log(personas);
});
//mensajes privados
socket.on('mensajePrivado',function (mensaje){
    console.log('Mensajes privados', mensaje);
});