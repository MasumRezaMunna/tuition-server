const mongoose = require('mongoose');
const { Schema } = mongoose;

const tuitionSchema = new Schema({
    subject: { type: String, required: true },
    classGrade: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    daysPerWeek: { type: Number, required: true },
    description: { type: String },
    
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    }
}, { timestamps: true });

const Tuition = mongoose.model('Tuition', tuitionSchema);
module.exports = Tuition;