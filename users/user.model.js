const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    uuid: { type: String, unique: true, required: true },
    password: { type: String },
    displayName: { type: String, unique: true },
    email: { type: String, unique: true, require: true },
    phone: { type: String, unique: true },
    role: { type: String, require: true },
    active: { type: Boolean, require: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('user', schema);