var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    msg : {type : String, required: true, trim: true},
    type: {type: String, enum: ["text", "image", "sticker"], default: "text", required: true},
    path: {type: String},
    date: {type: Date, required: true},
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sent: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true }
});
module.exports = mongoose.model('Message', MessageSchema);