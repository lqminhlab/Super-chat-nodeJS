const mongoose = require('mongoose');
var FriendSchema = new mongoose.Schema({
    state: {required: true, type: String, enum: ['request', 'block', "friend", "none"], default: 'none',},
    people: {type: [mongoose.Schema.Types.ObjectId], required: true, unique: true},
    requestor: {type: mongoose.Schema.Types.ObjectId},
    acceptTime: {type: Date, default: new Date()},
    intimate: {type: Number, default: 0}
});

module.exports = mongoose.model('Friend', FriendSchema);      