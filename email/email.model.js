const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    uuid: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    displayName: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('mail', schema);