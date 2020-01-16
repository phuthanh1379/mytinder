const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate'
    }
});

module.exports = mongoose.model('Student', studentSchema);