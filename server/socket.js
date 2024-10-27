const { io } = require(".");
const { createRoom, getrooms, joinroom, sendmessage, startMatch, leaveroom, matchend, updatematch } = require("./Room methods");



if(!io){
    return;
}
io.on('connection', async(socket) => {
    console.log('user connected')
    try {
        socket.on('roommessage',(message)=>{
            sendmessage(message, socket);
        })
        socket.on('updatematch',(data)=>{
            updatematch(data,socket)
        })
        socket.on('startmatch', (data)=>{
            startMatch(data, socket);
        })
        socket.on('matchend', (data)=>{
            matchend(data, socket);
        })
        socket.on('JOINROOM', (data) => {
            joinroom(data, socket)
        });
        socket.on('CREATEROOM', (data)=>{
            createRoom(data, socket)
        });
        
        socket.on('LEAVEROOM',(data)=>{
            leaveroom(data, socket)
        })
        socket.on('GETROOMS',()=>{
        getrooms(socket)
        })
        socket.on('disconnect',()=>{
            console.log('user disconnected');
        })
    } catch (error) {
        console.log(err);
    }
});
