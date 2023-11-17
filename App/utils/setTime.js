function setTime(res, time, text) {
    setTimeout(() => {
        res.send(text);
    }, time);
}





module.exports = {setTime}