const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    holderName: { type: String, required: true},
    recordDate: { type: Date, required: true },
    certificateType: { type: String, required: true },
    bandLevel: { type: Number, required: true }
});

module.exports = mongoose.model('Certificate', certificateSchema);