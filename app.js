var app = require('express').createServer(), 
	express = require('express'),
	io = require('socket.io').listen(app);

// **************
// *** CONFIG ***
// **************

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'EJS');
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
});

app.listen(8080);

// **************
// *** ROUTES ***
// **************

app.get('/', function (req, res) {
	res.render('layout', {locals:{title: '1984 — Index'}});
});

// ***************
// *** SOCKETS ***
// ***************

io.sockets.on('connection', function (socket) {
	
	var id = socket.id;
	
	// Réponse à la connec.
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