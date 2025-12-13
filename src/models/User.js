const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'tutor', 'admin'], 
        default: 'student' 
    },
    phone: {
        type: String,
        required: function() { return this.role !== 'admin'; }
    },
    photoURL: {
        type: String,
        default: ''
    },
    accountStatus: {
        type: String,
        enum: ['active', 'blocked', 'pending'],
        default: 'active'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;