// funcines para renderizar usuarios
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');
// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

function renderizarUsuarios(personas) {
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

function renderizarMensajes(resp, yo) {
    var html = '';
    var fecha = new Date(resp.fecha);
    var laHora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass='info';
    if(resp.nombre==='Administrador'){
        adminClass='danger'
    }
    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + resp.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + resp.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/4.jpg" alt="user"/></div>';
        html += '<div class="chat-time">' + laHora + '</div>';
        html += '</li>';
    } else {
        html += '<li>';
        if(resp.nombre!=='Administrador'){
            html += '<div class="chat-img animated fadeIn"><img src="assets/images/users/1.jpg" alt="user"/>';
        }
        html += '</div>';
        html += '<div class="chat-content">';
        html += '<h5>' + resp.nombre + '</h5>';
        html += '<div class="box bg-light-'+adminClass+'">' + resp.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + laHora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//listeners
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');
    if (id) {
        console.log('id', id);
    }
});

formEnviar.on('submit', function (e) {
    e.preventDefault(); //evita la navegación
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    socket.emit('crearMensaje', {
        nombre: nombre,
        sala: sala,
        mensaje: txtMensaje.val()
    }, function (resp) {
        renderizarMensajes(resp,true);
        txtMensaje.val('').focus();
        scrollBottom();
    });
});
