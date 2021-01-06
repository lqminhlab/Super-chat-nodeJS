const mongoose = require('mongoose');
var StickerGroupSchema = new mongoose.Schema({
    path: {type: String},
    name: {type: String}
});

StickerGroupSchema.virtual('count')
.get(()=>10);

module.exports = mongoose.model('StickerGroup', StickerGroupSchema);