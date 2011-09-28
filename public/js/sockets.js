var messageToken = false;
$(function() {
	// Init socket
    var socket = io.connect('127.0.0.1:8080');
    var id;
    
    // Retour de connexion
    socket.on('connected', function (data) {
    	id = data;
    });
    
    // Mouvement de la souris
    // Décalé de 200ms pour éviter le spam de requetes trop tôt
    setTimeout(function() {
    	$(document).mousemove(function (e) {
    		if(messageToken) {
    			socket.emit('updatePosition', {x: e.pageX, y: e.pageY, id: id});	
    			messageToken = false;
    		}
    		
    		$('#localMessage').css({left: e.pageX + 20, top: e.pageY});
    	});
    	setInterval(function() {messageToken = true}, 10);
    }, 200);
    
    // Submit du message
    $('#messageform').submit(function() {
    	socket.emit('updateMessage', {message: $('input', this).val(), id: id});
    	$('#messageform input').val("");
    	return false;
    });

    // Réception du message
    socket.on('pushMessage', function(data) {
    	if($('#' + data.id).length) {
    		$('#' + data.id).prepend('<p>'+data.message+'</p>');
    		$('p', '#' + data.id).first().delay(5000).fadeOut(500, function() {
    			$(this).empty();
    			$(this).show();
    		});
    	}
    	if(data.id == id) {
    		$('#localMessage').prepend('<p>'+data.message+'</p>');
    		$('p', '#localMessage').first().delay(5000).fadeOut(500, function() {
    			$(this).empty();
    			$(this).show();
    		});
    	}
    });

    // Récupération de la position des autres
    socket.on('pushPosition', function(data) {
    	if(!$('#' + data.id).length && data.id != undefined) {
    		$('body').append('<div class="cursor" id="'+data.id+'"></div>');
    	}
    	$('#' + data.id).css({left: data.x, top: data.y});
    });
    
    // Déconnexion
    socket.on('disconnected', function (id) {
    	console.log('logout');	
    	$('#' + id).remove();
    });
});