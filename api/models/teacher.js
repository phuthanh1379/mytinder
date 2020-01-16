const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: true
    },
    avgScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('Teacher', teacherSchema);