const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  eventId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attended:   { type: Boolean, default: false },
  attendedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
