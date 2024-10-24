const { generateId } = require("../helpers/index");
const {ROOMS_ID, ROOM_DETAILS} = require("../user data/index")

module.exports.createRoom =(data, socket)=>{
    try {
        if (!data.roomname || !data.limit || !data.type || (data.type === "private" && !data.code) || !data.duration || !data.publickey || !data.name ) {
            const err = { type: 'error', error: 'Not all necessary information is present' };
            socket.send(err);
            return;
        }
        const id = generateId();
        ROOMS_ID.push({ id, type: data.type, roomname: data.roomname, limit: data.limit, mems: 1 });
        ROOM_DETAILS.set(id, 
            { 
            roomname:data.roomname,
            limit: data.limit,
            type:data.type,
            code:data.code,
            duration:data.duration,
            text:data.text || null,
            numbers:data.numbers || false,
            symbols:data.numbers || false,
            mems: 1, 
            ready:0,
            memslist:[{name:data.name, id:socket.id, publickey:data.publickey, points:0, ready:false}] });
        socket.join(id);
        socket.send({ type:"CREATEROOM",roomtype: data.type, message: "Room created successfully.", roomname:data.roomname, id, memslist:[{name:data.name, id:socket.id, publickey:data.publickey, points:0}] });
        
    } catch (error) {
        console.error(error);
        const err = { type: 'error', error: 'Something went wrong while creating room' };
        socket.send(err);
    }
}