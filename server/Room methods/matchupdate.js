const { findRoom, sort } = require("../helpers");
const { ROOM_DETAILS } = require("../user data");

module.exports.updatematch =(data, socket)=>{
    try {
        if(!data.id || !data.wpm || !data.raw || !data.accuracy){
            return ;
        }
        const {room, pos} = findRoom(data);
        const rdata = ROOM_DETAILS.get(room.id);
        if(!room || !rdata){
            return;
        }

        for(let i =0;i<rdata.memslist.length;i++){
            const mem = rdata.memslist[i];
            if(mem.id === socket.id ){
                mem.points = {w:data.wpm,r:data.raw,a:data.accuracy};
                rdata.memslist[i] = mem;
                break;
            }
        }

        sort(rdata.memslist,0);
        const list =[];
        rdata.memslist.map(({id,name,points})=>{
            list.push[{id,name,points}];
        })
        ROOM_DETAILS.set(room.id,rdata);
        io.to(room.id).emit(`${room.id}message`,{type:'result',list})
    } catch (error) {
        console.error(error);
        const err = { type: 'error', error: 'Something went wrong while updating data' };
        socket.send(err);
    }
    
}