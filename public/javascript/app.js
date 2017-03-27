$(function () {
      var socket = io();      
      
      var sender = prompt('Who are you?');
      var recipient = prompt('Who do you wish to talk with?');

      socket.emit('broadcast', "Hey! " + sender + ' is online.');

      document.title = sender + '/' + recipient + ' - ' + document.title;

      // updates chat info
      $("#recipient_name").text(recipient);
      $("#current_time").text(new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"));

      // create chat ID
      var chat_id = sender > recipient ? sender + '|' + recipient : recipient + '|' + sender; // it cannot be equals

      // builds a message; self or other
      build_msg = function(msg){
        console.log("chat load response: " + JSON.stringify(msg) + msg.user);

        if ( sender == msg.user ){
          msg_class = "self";
          img = "http://i.imgur.com/HYcn9xO.png";
        }else{
          msg_class = "other";
          img = "http://i.imgur.com/DY6gND0.png";
        }

        // setup div img
        avatar = $('<div>')
          .append(
            $('<img>').attr("src", img)
          ).addClass("avatar");

        // setup div msg
        msg = $('<div>')
          .append(
            $('<p>').text(msg.text)
          )
          .append(
            $('<time>').text(new Date(msg.timestamp))
          )
          .addClass("msg")
        

        // add msg to the view
        $('#messages')
          .append(
            $('<li>')
              .append(avatar)
              .append(msg)
              .addClass(msg_class)
          );

        // updates scroll to show the last message
        $(window).scrollTop($("#messages")[0].scrollHeight);
      };

      // load chat messages
      $.ajax({
        type:"POST",
        contentType: 'application/json',
        url: "/load_chat",
        data: JSON.stringify({
          channel: chat_id
        }),
        global: false,
        async:false,
        success: function(data){
          //console.log("chat load response: " + data);

          var chat = JSON.parse(data)[chat_id] || {};

          console.log("chat: " + JSON.stringify(chat));
          messages = chat.msgs || [];

          console.log("messages: " + messages);

          var color = 'black';
          messages.forEach(function(elem){

            build_msg(elem);

          });

        }
      });

      // sends message
      $("#m").on( "keydown", function (event) {
        if(event.which == 13){
         data = {
          timestamp: Date.now(), //must to be 'UTC'
          channel: chat_id,
          user: sender,
          msg: $('#m').val()
        }

        console.log( JSON.stringify(data) );

        socket.emit( 'to_user', JSON.stringify(data) );
        $('#m').val('');
        return false;
        }
      });

      // updates messages view
      socket.on(chat_id, function(data){
        build_msg(data);
      });

      socket.on('broadcast', function(msg){
        $('#messages').append($('<li >').text(msg).css({'color':'green'}));
      });
    });