const { io } = require("..");
const { findRoom } = require("../helpers");
const { ROOMS_ID, ROOM_DETAILS } = require("../user data");

module.exports.leaveroom =(data, socket)=>{
    try {
        if(!data.id || !data.name) return;
        const {room,pos} = findRoom(data);
        if(!room){
            return;
        }
        if(room.mems == 1){
            ROOMS_ID.splice(pos,1);
            ROOM_DETAILS.delete(room.id);
        }else{
            const rdata = ROOM_DETAILS.get(room.id);
            room.mems -=1;
            const {memslist} = rdata;
            for(let i=0;i<memslist.length;i++){
                if(memslist[i].id === socket.id){
                    if(memslist.ready){
                        rdata.ready -=1;
                    }
                    rdata.mems -=1;
                    console.log(rdata)
                    if(rdata.ready === rdata.mems){
                        io.to(data.id).emit(`${data.id}message`,{type:"start",text:rdata.text, duration:rdata.duration});
                    }
                    memslist.splice(i,1);
                    break;
                }
            }
            rdata.memslist = memslist;
            ROOM_DETAILS.set(room.id, rdata);
            ROOMS_ID[pos] = room;
            socket.leave(room.id);
            io.to(room.id).emit(`${room.id}message`,{type:"left",member:data.name,message:`${data.name} left the room`})
        }
    } catch (error) {
        console.log(error)
        const err = {
            type:'error',
            error:'Something went wrong while leaving room'
        }
        socket.send(err);
    }
}