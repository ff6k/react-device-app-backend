const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    uid: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    address: { type: String, require: true },
    categories: { type: Array },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('lift', schema);