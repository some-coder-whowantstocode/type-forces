const { io } = require(".");
const { createRoom, getrooms, joinroom, sendmessage, startMatch, leaveroom, matchend } = require("./Room methods");
const { UserList } = require("./user data");


if(!io){
    return
}
io.on('connection', async(socket) => {
    try {
        socket.on('roommessage',(message)=>{
            sendmessage(message, socket);
            
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
            if(UserList.has(socket.id)){
                leaveroom({id:socket.id},socket);
            }
            console.log('user disconnected');
        })
    } catch (error) {
        console.log(err);
    }
});
