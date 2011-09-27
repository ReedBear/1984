var app = require('express').createServer(), 
	express = require('express'),
	io = require('socket.io').listen(app);

app.use(express.static(__dirname + '/client'));
app.listen(80);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function (socket) {
	var id = socket.id;
	
	// Réponse
	socket.emit('connected', id);
	
	// Update de la position
	socket.on('updatePosition', function (data) {
		// Broadcast de la position
		socket.broadcast.volatile.emit('pushPosition', data);
	});
	
	// Affichage du chat
	socket.on('updateMessage', function (data) {	
		io.sockets.emit('pushMessage', data);
	});
	
	// Déconnexion
	socket.on('disconnect', function () {
		socket.broadcast.emit('disconnected', id);
	});
});