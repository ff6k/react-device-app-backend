const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // deviceId: { type:  mongoose.Schema.Types.ObjectId, ref: 'Product' },
    index: { type: String, required: true },
    device: {
        id: { type: String, required: true },
    },
    timestamp: { type: Date, default: Date.now },
    message: {
        "ID": { type: Number },
        "log": { type: String },
        "errid": { type: Number },
        "state": { type: Number },
        "trials": { type: Number },
        "stop": { type: Number },
        "enc": { type: Number },
        "speed": { type: Number },
        "inLevel": { type: Number },
        "trips": { type: Number },
        "dest": { type: Number },
        "text": { type: String },
    },
    status: { type: Boolean, default: false },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('event', schema);