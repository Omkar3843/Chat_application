const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const connect = require('./config/db-config');

// app.get('/', (req,res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/public')); 

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

    // socket.on('from_client', () => {
    //     console.log("recived event from client");
    // });

    // setInterval(function f() {
    //     socket.emit('from_server');
    // }, 3000);

    socket.on('new_msg', (data) => {
        /*
        1. io.emit() is used for to send the all connections
        2. socket.emit() is used to get revert back to its own fron server
        3. socket.broadcast is used for to broadcast all other client expect who is sending 
        */
        io.emit('msg_rcvd', data);
        // socket.emit('msg_rcvd', data);
        // socket.broadcast('msg_rcvd', data);
    });

    socket.on('join_room', (data) => {
        console.log("joining a room ", data.roomid);
        socket.join(data);
    })
    
});

app.get('/chat/:roomid', async (req,res) => {
    res.render('index', {name: 'sanket'});
});

server.listen(3000, async () => {
    console.log('listening on*:3000');
    await connect();
    console.log("DB Connected");
});