const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ''
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
    default: ''
  },
  photoURL: {
    type: String,
    default: ''
  },
  accountStatus: {
    type: String,
    enum: ['active', 'blocked', 'pending'],
    default: 'active'
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  roleUpdatedAt: Date
}, { timestamps: true });

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
