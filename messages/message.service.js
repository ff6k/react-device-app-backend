const db = require('_helpers/db');
const Message = db.Message;

module.exports = {
    getAll,
    getByDeviceId,
    getById,
    getByLog,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Message.find();
}

async function getByDeviceId(messageParam) { 
    return Message.find({ 'message.ID': messageParam.deviceId }); 
}

async function getByLog(messageParam) { 
    return Message.find({ 'message.log': messageParam.log }); 
}

async function getById(id) {  
    return await Message.findById(id);
}

async function create(messageParam) {
    // validate
  
    // if (await Message.findOne({ name: messageParam.name })) {
    //     throw 'Name "' + messageParam.name + '" is already taken';
    // }

    const message = new Message(messageParam);

    // save message
    await message.save();
}

async function update(id, messageParam) { 
    const message = await Message.findById(id);

    // validate
    if (!message) throw 'Message not found';

    // copy messageParam properties to message
    Object.assign(message, messageParam);

    await message.save();
}

async function _delete(id) {
    await Message.findByIdAndRemove(id);
}