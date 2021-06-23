const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    uid: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    displayName: { type: String },
    email: { type: String, required: true },
    emailValidation: { type: Boolean, requird: true },
    phone: { type: String },
    role: { type: String },
    devices: { type: Array },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('customer', schema);