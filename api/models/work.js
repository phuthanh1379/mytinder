const mongoose = require('mongoose');

const workSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    studentFeedback: {
        type: String,
        required: true
    },
    teacherFeedback: {
        type: String,
        required: true
    },
    teacherScore: { 
        type: Number, 
        required: true,
        validate: [scoreLimit, '{PATH} exceeds the limit of 10']
    }
});

function scoreLimit(val) {
    return val <= 10;
}

module.exports = mongoose.model('Work', workSchema);