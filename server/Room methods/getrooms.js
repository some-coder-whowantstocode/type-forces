const { ROOMS_ID } = require("../user data");

module.exports.getrooms =(socket)=>{
    try {
        socket.send({type:"GETROOMS",rooms:ROOMS_ID})
    } catch (error) {
        const err = {
            type:'error',
            error:'Something went wrong while getting rooms'
        }
        socket.send(err);
    }
}