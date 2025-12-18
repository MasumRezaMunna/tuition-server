const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
    tuitionId: { type: Schema.Types.ObjectId, ref: 'Tuition', required: true }, 
    subject: { type: String, required: true },
    studentEmail: { type: String, required: true },
    
    tutorName: { type: String, required: true },
    tutorEmail: { type: String, required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    approvedAt: { type: Date }, 
    studentId: { type: Schema.Types.ObjectId, ref: 'User' }, 
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }, 
    paymentIntentId: { type: String } 
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
