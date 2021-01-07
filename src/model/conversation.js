var mongoose = require('mongoose');
var ConversationSchema = new mongoose.Schema({
    name: {type: String, maxlength: 100},
    type: {String, enum: ['normal', 'group'], default: 'normal', required: true},
    people: {type: [mongoose.Schema.Types.ObjectId], required: true},
    last: {type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model('Conversation', ConversationSchema);