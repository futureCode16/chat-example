$(document).ready(function () {
  var nickname = $('#nickname');
  $('#logIn').on('click', function () {

    var socket = io();
    var users = [];
    var typingStatus = 0;

    $('#register').hide();
    $(".container").show();

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
            class: 'test',
            id: fr[i]
          }).css({ "font-style": "italic" }).html(fr[i]).appendTo('#chatsOnline');
          $('#messageBody').append($('<p>').css({'textAlign':'center'}).html(fr[i]+' has join the group'))
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
    })

    $('#send').on('click', function () {
      socket.emit("chat message", { 'message': $('#message').val(), 'sender': userNickname });
      $('#message').val('');
      return false;
    });

  });
})