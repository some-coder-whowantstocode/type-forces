const { io } = require("..");
const { findRoom } = require("../helpers");
const { ROOMS_ID, ROOM_DETAILS } = require("../user data");


module.exports.joinroom =(data, socket)=>{
    try {
        if (ROOMS_ID.length === 0) return;
        const {room , pos} = findRoom(data);
        if (!room) {
            const err = { type: 'error', error: 'No such room exists' };
            socket.send(err);
            return;
        }
        if (room.mems === room.limit) {
            const err = { type: 'error', error: 'Room is already full' };
            socket.send(err);
            return;
        } 
        if(room.type === 'private' &&( !room.code || room.code !== data.code)){
            const err = { type: 'error', error: 'invalid information' };
            socket.send(err);
            return ;
        }
        
         // if alredy exists
        const rdata = ROOM_DETAILS.get(room.id);
        for(let i=0;i<rdata.memslist.length ;i++){
            const tempmem = rdata.memslist[i];
            if(tempmem.name === data.name || tempmem.id === socket.id ){
                const err = { type: 'error', error: 'User alredy exists in this room.' };
                socket.send(err);
                return;
            }
        }
        room.mems += 1;
        ROOMS_ID[pos] = room;
        
        rdata.mems += 1;
        rdata.memslist.push({name:data.name, id:socket.id, publickey:data.publickey, points:{w:0,r:0,a:0},active:true});
        ROOM_DETAILS.set(room.id, rdata);
        socket.join(room.id);
        io.to(room.id).emit(`${room.id}message`,{type:"joinroom",message:data.name+' Joined room', newmem:{name:data.name, id:socket.id, publickey:data.publickey, points:{w:0,r:0,a:0},active:true}} );
        socket.send({type:"JOINROOM",roomtype: room.type, message: "Room joined successfully.",duration:data.duration,name:data.name, roomname:rdata.roomname, id:room.id, members:rdata.memslist});
    } catch (error) {
        console.error(error);
        const err = { type: 'error', error: 'Something went wrong while joining the room' };
        socket.send(err);
    }
}