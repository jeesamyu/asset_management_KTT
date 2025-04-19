module.exports = async function customReply(res , data) {
    let response = {
        ...data,
        status: code > 200 ? 1 : 0
    } 
    return res.status(200, data)
}