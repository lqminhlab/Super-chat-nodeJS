var mongoose = require('mongoose');
var ProviderSchema = new mongoose.Schema({
    provider : {type : String, enum: ["facebook", "google", "zalo", "apple"], required: true},
    provider_id: {type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
module.exports = mongoose.model('Provider', ProviderSchema);