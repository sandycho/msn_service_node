var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);
var bodyParser = require('body-parser');

var index = require('./routes/index');
var io = require('./services/messaging').listen(server);


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

app.use('/', index);
app.use(function(req, res, next){
  res.io = io;
  next();
});


server.listen(3000, function(){
  console.log('listening on *:3000');
});