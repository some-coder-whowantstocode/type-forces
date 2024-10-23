const {ROOMS_ID} = require('../user data/index')

module.exports.findRoom=( data)=>{
    try {
        let room, pos;
            let i = 0, j = ROOMS_ID.length - 1;
            while (i <= j) {
                const m = Math.floor((i + j) / 2);
                const { id } = ROOMS_ID[m];
                if (data.id === id) {
                    room = ROOMS_ID[m];
                    pos = m;
                    break;
                }
                if (data.id < id) {
                    j = m - 1;
                } else {
                    i = m + 1;
                }
            }
        return {room, pos};
    } catch (error) {
        console.log(error);
        throw new Error("some thing went wrong");
    }
}