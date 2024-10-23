const { io } = require("..");
const { findRoom } = require("../helpers");

module.exports.sendmessage=(message, socket)=>{
    try {
        if(!message.id){
            const err = { type: `error`, error: 'Something went wrong with the site please restart it' };
            socket.send(err);
            return;
        }
        const {room} = findRoom(message);
        if (!room) {
            const err = { type: `error`, error: 'No such room exists' };
            socket.send(err);
            return;
        }
        io.to(message.sid).emit(`${message.id}message`,{type:"chat",text:message.text, name: message.name });
    } catch (error) {
        console.error(error);
        const err = { type: 'error', error: 'Something went wrong while sending message '};
        socket.send(err);
    }
}