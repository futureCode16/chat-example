$(document).ready(function () {
  var nickname = $('#nickname');
  $(".container").hide();
  $('#logIn').on('click', function () {

    var socket = io();
    var users = [];
    var topic;

    $('#register').hide();
    $(".container").show();

    var userNickname = nickname.val();

    socket.emit('friend', userNickname);
    socket.on(userNickname, function (msg) {
      $('#messageBody').append($('<li>').text(msg.message));
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
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
    })
    $(document).on('click', '.test', function () {
      topic = $(this).text();
      $('#nicknameHeader').html(topic);

      $('#send').on('click', function () {
        console.log("client" + topic)
        socket.emit("chat message", { message: $('#message').val(), user: topic });
        $('#message').val('');
        return false;
      });
    })

  });
})