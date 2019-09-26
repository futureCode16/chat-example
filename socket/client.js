$(document).ready(function () {
  //Bargaso, Renan Code
  var nickname = $('#nickname');
  $('#logIn').on('click', function () {

    var socket = io();
    var users = [];
    var typingStatus = 0;
    var messageRecipient = "";
    var blink = null;
    var messages = {};

    $('#register').hide();
    $(".container").show();
    $('#header').show();

    var userNickname = nickname.val();

    socket.emit('friend', userNickname);

    $('#message').on('keypress', function () {
      ++typingStatus;
      socket.emit('typing', { 'sender': userNickname, 'message': $('#message').val(), 'typeStatus': typingStatus });
    });

    socket.on('typing status', function (status) {
      if (status.typeStatus == 1) {
        $('#messageBody').append($('<p>').addClass('status').text(status.sender + " is typing..."));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('message', function (msg) {
      var messageCount = msg.count;
      if (msg.sender == userNickname && msg.message !== "") {
        $('#messageBody').append($('<div>').css({
          "width": "100%", "float": "right", "white-space": "initial",
          "textOverflow": "ellipsis", "wordWrap": "break-word", "overflow": "hidden",
        }).attr("id", messageCount.toString()))

        $('#' + messageCount).append($('<div>').css({
          "textAlign": "right", "padding": "5px", "overFlow": "auto", "float": "right",
          "borderRadius": "15px", "paddingRight": "20px", "border": "1px solid black",
          "width": "50%", "background": "#9fff80"
        }).html(msg.message));
      } else if (msg.message !== "") {
        $('#messageBody').append($('<div>').css({
          "width": "100%", "float": "left", "white-space": "initial",
          "textOverflow": "ellipsis", "wordWrap": "break-word", "overflow": "hidden"
        }).attr("id", messageCount.toString()))

        $('#' + messageCount).append($('<p>').css({
          "textAlign": "left", "padding": "5px", "overFlow": "auto", "float": "left",
          "borderRadius": "15px", "paddingLeft": "20px", "border": "1px solid black", "marginBottom": "0px",
          "width": "50%", "backgroundColor": "white"
        }).text(msg.sender + " : " + msg.message));
      }
      $('.status').remove();
      typingStatus = 0;
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('online', function (fr) {
      for (var i = 0; i < fr.length; ++i) {
        if (fr[i] != userNickname && !users.includes(fr[i])) {
          users.push(fr[i]);
          $('<div/>', {
            class: 'privateMsg',
            id: fr[i]
          }).css({
            'background': '#ccebfc', 'paddingLeft': '5px', 'marginBottom': '2px',
          }).append('<p>').css({
            'color': 'green', 'fontWeight': 'bold', 'fontSize': '20px'
          }).html('•&nbsp;&nbsp;')
            .append($('<label>').css({ 'color': 'black', 'fontSize': '17px' }).html(fr[i]))
            .appendTo('#chatsOnline');
          $('#' + fr[i]).on('mouseover', function () {
            $(this).css({ 'background': '#6dc6f7', 'cursor': 'pointer' });
          });
          $('#' + fr[i]).on('mouseout', function () {
            $(this).css({ 'background': '#ccebfc' });
          });

          $('#' + fr[i]).on('click', function () {
            messageRecipient = $(this)[0].id;
            console.log(messageRecipient);
          });

          $('#messageBody').append($('<p>').css({ 'textAlign': 'center', 'fontSize': '12px' }).html(fr[i] + ' has join the group'))
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
    })

    socket.on(userNickname, function (msg) {
      if (msg.message !== "") {
        $('#inboxBody').append($('<div>').css({
          "width": "100%", "white-space": "initial", "textOverflow": "ellipsis", 'marginBottom': '2px',
          "wordWrap": "break-word", "overflow": "hidden", 'background': '#d2f3fa',
        }).attr("id", 'pinbox' + messageRecipient))

        blink = setInterval(function () {
          $('#inbox').fadeOut('slow', function () {
            $('#inbox').css({ 'boxShadow': '0px 0px 10px red' })
            $(this).fadeIn('slow', function () {
              $('#inbox').css({ 'boxShadow': '0px 0px 5px black' });
            });
          });
        }, 1000);

        if (msg.message.length <= 40) {
          var pmessage = msg.message.substring(0, 39);
          $('#pinbox' + messageRecipient).append($('<p>').css({
            'fontWeight': 'bold', 'paddingLeft': '5px'
          }).html(msg.sender + ' : '));
          $('#pinbox' + messageRecipient).append($('<p>').css({
            'paddingLeft': '50px', 'marginTop': '-20px', 'fontSize': '15px'
          }).html(pmessage));
        } else {
          var pmessage = msg.message.substring(0, 39) + '...';
          $('#pinbox' + messageRecipient).append($('<p>').css({
            'fontWeight': 'bold', 'paddingLeft': '5px'
          }).html(msg.sender + ' : '));
          $('#pinbox' + messageRecipient).append($('<p>').css({
            'paddingLeft': '50px', 'marginTop': '-20px', 'fontSize': '15px'
          }).html(pmessage));
        }
      }
    });

    //on enter send
    $('#message').keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        socket.emit("chat message", { 'message': $('#message').val(), 'sender': userNickname });
        $('#message').val('');
      }
    });

    $('#privatemessage').keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        socket.emit("private message", { 'message': $('#privatemessage').val(), 'sender': userNickname, 'receiver': messageRecipient });
        $('#privatemessage').val('');
      }
    });

    $('#inbox').on('click', function () {
      clearInterval(blink);
    });

  });
})