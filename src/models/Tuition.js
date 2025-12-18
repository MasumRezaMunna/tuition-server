const mongoose = require('mongoose');

const tuitionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  classGrade: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  daysPerWeek: {
    type: Number,
    min: 1,
    max: 7
  },
  description: {
    type: String,
    default: ''
  },

  studentEmail: {
    type: String,
    required: true,
    index: true
  },
  studentName: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

tuitionSchema.index({ subject: 1 });
tuitionSchema.index({ location: 1 });
tuitionSchema.index({ classGrade: 1 });

module.exports = mongoose.model('Tuition', tuitionSchema);
