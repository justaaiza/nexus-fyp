const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  status: { type: String, enum: ['forming', 'formed'], default: 'forming' }
}, { timestamps: true });
module.exports = mongoose.model('Group', groupSchema);