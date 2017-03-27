var express = require('express');
var router = express.Router();
var fs = require('fs');

/* POST load chat*/
router.post('/load_chat', function(req, res, next){
	console.log('routes: getting test - req.params: ' + JSON.stringify(req.body));
	
	body = req.body;

	channel = body.channel;
  chats = null;

	try{
      
      chats = fs.readFileSync('./database/messages.json');

  }catch(err){
  	console.log(err);
  }

  chats = (chats == undefined) ? {} : JSON.parse(chats);
  chat = chats[channel];

	res.send((chat == undefined) ? '{"' + channel + '":{}}' : '{"' + channel + '":' + JSON.stringify(chat) + '}');
});

module.exports = router;
