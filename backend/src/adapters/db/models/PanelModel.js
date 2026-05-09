const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Panel name is required'],
      trim: true,
    },
    juryMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    assignedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
      },
    ],
    defenseDate: {
      type: Date,
      default: null,
    },
    room: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Panel', panelSchema);
