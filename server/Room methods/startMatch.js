const { io } = require("..");
const { findRoom, generateText } = require("../helpers");
const { ROOM_DETAILS, ROOMS_ID } = require("../user data");

module.exports.startMatch =async(data, socket)=>{
    try {
        if(!data.id ){
            const err = { type: 'error', error: 'Something went wrong' };
            socket.send(err);
        }
        const {room} = findRoom(data);
        if(!room){
            const err = { type: 'error', error: 'Something went wrong' };
            socket.send(err);
        }
        const rdata = ROOM_DETAILS.get(room.id);
        for(let i=0;i<rdata.memslist.length;i++){
            const mem= rdata.memslist[i];
            const id = mem.id;
            if(id === socket.id){
                if(!mem.ready){
                    rdata.ready +=1;
                    if(rdata.ready === rdata.mems){
                        let text = rdata.text;
                        if(!rdata.text){
                            text = await generateText(rdata.numbers, rdata.symbols, 100);
                            console.log(rdata.numbers);
                        }
                        io.to(data.id).emit(`${data.id}message`,{type:"start",text:text, duration:rdata.duration});
                    }
                }else{
                    rdata.ready -=1;
                }
                mem.ready = true;
                rdata.memslist[i] = mem;
                break;
            }
            
        }
        ROOM_DETAILS.set(room.id,rdata);
        socket.send({type:'error',error:"Waiting for others...."})
    } catch (error) {
        console.error(error);
        const err = { type: 'error', error: 'Something went wrong' };
        socket.send(err);
    }
}