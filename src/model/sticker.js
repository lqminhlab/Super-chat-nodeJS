const mongoose = require('mongoose');
var StickerSchema = new mongoose.Schema({
    code: {required: true, type: String},
    path: {type: String},
    name: {type: String},
    group: {type: mongoose.Schema.Types.ObjectId, ref: "TickerGroup", required: true}
});

module.exports = mongoose.model('Sticker', StickerSchema);      