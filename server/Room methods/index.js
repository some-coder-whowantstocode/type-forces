const {createRoom} = require("./createroom")
const { getrooms } = require("./getrooms")
const { joinroom } = require("./joinroom")
const { leaveroom } = require("./leaveroom")
const { matchend } = require("./matchend")
const { sendmessage } = require("./sendmessage")
const { startMatch } = require("./startMatch")

module.exports={
    createRoom,
    getrooms,
    joinroom,
    sendmessage,
    startMatch,
    leaveroom,
    matchend
}