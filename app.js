var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),//permet de bloquer les caractere html
    fs = require('fs');

//chargement de la page index.html

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function (socket,pseudo) {
    //des qu'on nous donne un pseudo , on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    //des que l'on recoit un message, on recupere le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message',function (message) {
        message = ent.encode(message);
        console.log(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    })
    });

server.listen(8080);
