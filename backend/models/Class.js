const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subjectName: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
