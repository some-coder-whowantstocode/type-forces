const { io } = require("..");
const { findRoom } = require("../helpers");
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
  


module.exports.matchend = (data, socket)=>{
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
    const points = calculateCompetitionPoints(data.raw, data.wpm, data.accuracy);
    const rdata = ROOM_DETAILS.get(room.id);

    for(let i =0;i<rdata.memslist.length;i++){
        const mem = rdata.memslist[i];
        if(mem.id === socket.id && mem.ready){
            mem.points = points;
            mem.ready = false;
            rdata.ready -=1;
            rdata.memslist[i] = mem;
            break;
        }
    }

    ROOM_DETAILS.set(room.id,rdata);
    io.to(room.id).emit(`${room.id}message`,{type:'result',id:socket.id,points})
    } catch (error) {
        console.log(error)
        const err = {
            type:'error',
            error:'Something went wrong while getting points'
        }
        socket.send(err);
    }
    
}