var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;

server.listen(PORT, function(){
    console.log('Server has listem in port ' + PORT);
});

// Roution
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Number user, date enter
var users = [{}];

io.on('connection', function(socket){
    users = cleanArray(users);
    users.push({'id': new Date().getUTCMilliseconds(), index: socket.id, escrevendo: false});

    io.emit('home', {title: 'Hello World and VueJs, NodeJs, Bower', you: socket.id, users: users});

    socket.on('start digiter', function(index){
        socket.broadcast.emit('digiter', {'index': index, digiter: true});
    });

    socket.on('stop digiter', function(index){
        setTimeout(function(){
            socket.broadcast.emit('digiter', {'index': index, digiter: false});
        }, 2000);
    });

    socket.on('send', function(message){
        socket.broadcast.emit('send', message);
    })

    socket.on('disconnect', function(){
        socket.broadcast.emit('user disconnect', {
            index: socket.id
        })
    });
});

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i].index) {
        newArray.push(actual[i]);
    }
  }
  return newArray;
}
