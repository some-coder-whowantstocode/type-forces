const { io } = require("..");
const { findRoom, generateText } = require("../helpers");
const { ROOM_DETAILS, ROOMS_ID } = require("../user data");

module.exports.startMatch =async(data, socket)=>{
    try {
        if(!data.id ){
            const err = { type: 'error', error: 'Something went wrong' };
            socket.send(err);
            return;
        }
        const {room} = findRoom(data);
        if(!room){
            const err = { type: 'error', error: 'Something went wrong' };
            socket.send(err);
            return;
        }
        const rdata = ROOM_DETAILS.get(room.id);
        for(let i=0;i<rdata.memslist.length;i++){
            const mem= rdata.memslist[i];
            const id = mem.id;
            if(id === socket.id){
                text = await generateText(rdata.numbers, rdata.symbols, 100);
                socket.emit(`${data.id}message`,{type:"start",text:text, duration:rdata.duration});
                rdata.memslist[i] = mem;
                break;
            }
            
        }
        ROOM_DETAILS.set(room.id,rdata);
    } catch (error) {
        console.error(error);
        const err = { type: 'error', error: 'Something went wrong' };
        socket.send(err);
    }
}