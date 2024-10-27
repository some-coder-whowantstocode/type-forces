const { io } = require("..");
const { findRoom, sort } = require("../helpers");
const { ROOM_DETAILS, ROOMS_ID } = require("../user data");

function calculateCompetitionPoints(rawWPM, netWPM, accuracy) {
    const basePoints = 50;
    const rawWPMFactor = 1;
    const netWPMFactor = 2;
    const accuracyFactor = 1; // Since accuracy is now from 0 to 100
    
    const rawWPMPoints = rawWPM * rawWPMFactor;
    const netWPMPoints = netWPM * netWPMFactor;
    const accuracyPoints = accuracy * accuracyFactor;
    
    const totalPoints = basePoints + rawWPMPoints + netWPMPoints + accuracyPoints;
    return totalPoints;
  }
  


module.exports.matchend = async(data, socket)=>{
    try {
        if(!data.id || !data.wpm || !data.raw || !data.accuracy) return;
    const {room, pos} = findRoom(data);
    if(!room){
        const err = {
            type:'error',
            error:'Something went wrong while getting rooms'
        }
        socket.send(err);
        return
    }
    const rdata = ROOM_DETAILS.get(room.id);
    for(let i =0;i<rdata.memslist.length;i++){
        const mem = rdata.memslist[i];
        if(mem.id === socket.id ){
            mem.points = {w:data.wpm,r:data.raw,a:data.accuracy};
            rdata.memslist[i] = mem;
            break;
        }
    }
    sort(rdata.memslist,0);
    const list =[]
    await rdata.memslist.map(({id,name,publickey,points, active})=>{
        list.push({id,name,publickey,points, active});
    })
    ROOM_DETAILS.set(room.id,rdata);
    io.to(room.id).emit(`${room.id}message`,{type:'result',list})
    
    } catch (error) {
        console.log(error)
        const err = {
            type:'error',
            error:'Something went wrong while getting points'
        }
        socket.send(err);
    }
    
}