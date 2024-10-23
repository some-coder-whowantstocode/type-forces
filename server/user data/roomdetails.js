module.exports.ROOM_DETAILS = new Map(); 

/*
id : id of the room unique,
{
name : name of the room can be multiple,
mems : number of members,
limit : number of members allowed,
memslist : Array of members [name, id : socket.id, publickey],
type : public / private,
code : if private then code
}
*/