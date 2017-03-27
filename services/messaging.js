// messaging service
var socketio = require('socket.io');
var fs = require('fs');

module.exports.listen = function(app){
  io = socketio.listen(app);

  io.on('connection', function(socket){
	  console.log('a user connected');

	  // on broadcast messages
	  socket.on('broadcast', function(msg){
	    console.log('message: ' + msg);
	    
	    io.emit('broadcast', msg);

	  });

	  // particular user messages
	  socket.on('to_user', function(msg){

	    chat_data = JSON.parse(msg);

	    console.log( 'message: ' + JSON.stringify(chat_data) );

	    io.emit(chat_data.channel, {text: chat_data.msg, user: chat_data.user, timestamp: chat_data.timestamp});

	    chat_id = channel;
	    chats = null;

	    try{      
	      chats = fs.readFileSync('./database/messages.json');
	    }catch(err){
	    	console.log(err);
	    }

			chats = (chats == undefined) ? JSON.parse('{"' + chat_id + '":{"msgs":[]}}') : JSON.parse(chats);
			chat = (chats[chat_id] == undefined) ? JSON.parse('{"msgs":[]}') : chats[chat_id];
			msgs = chat.msgs;

			message = {
				timestamp: chat_data.timestamp,
				user: chat_data.user,
				text: chat_data.msg
			}

			msgs.push(message);
			chats[chat_id] = {msgs: msgs};

	    fs.writeFile("./database/messages.json", JSON.stringify(chats), {flag: 'w'}, function(err){
	      if(err){
	        return console.log(err);
	      }
	    });

	  });

	  // fires a disconnect event
	  socket.on('disconnect', function(){
	    console.log('user disconnected');
	  });
	});

  return io;
}

