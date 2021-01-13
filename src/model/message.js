var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    msg : {type : String, trim: true},
    type: {type: String, enum: ["text", "image", "sticker"], default: "text"},
    path: {type: String},
    date: {type: Date, required: true},
    reader: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sent: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true }
});
module.exports = mongoose.model('Message', MessageSchema);