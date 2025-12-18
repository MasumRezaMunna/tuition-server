const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
    tuitionId: { type: String, required: true },
    subject: { type: String, required: true },
    studentEmail: { type: String, required: true },
    
    tutorName: { type: String, required: true },
    tutorEmail: { type: String, required: true },
    tutorId: { type: String, required: true },
    
    status: { type: String, default: 'pending' } 
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;