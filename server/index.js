const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config();

const port = process.env.PORT; 
const app = express();
const server = createServer(app);
module.exports.io = new Server(server,{
    cors:{
        origin: process.env.ORIGIN, 
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

require('./socket')


app.get('/', (req, res) => {
    res.send('working');
});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});