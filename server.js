const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { measureMemory } = require('vm');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};


io.on('connection', socket => {
    console.log("New User Connected");

    socket.on('new-user-joined', Name => {
        users[socket.id] = Name;
        socket.broadcast.emit('user-join-message', Name)
    })


    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {
            Name : users[socket.id],
            message : message
        });
    })


    socket.on('disconnect', ()=> {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    })
});

const port = process.env.PORT || 3000;

server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
