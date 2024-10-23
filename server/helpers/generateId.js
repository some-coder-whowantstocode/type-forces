var { lastTimestamp, counter } = require("../user data");

module.exports.generateId=()=>  {
    const now = Date.now();
    if (now === lastTimestamp) {
        counter++;
    } else {
        lastTimestamp = now;
        counter = 0;
    }
    return Number(`${now}${counter}`);
}
