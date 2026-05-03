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
      type: String,   // kept as string (e.g. "Mon, 27 Apr · 09:00-10:00") matching frontend
      default: null,
    },
    room: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Panel', panelSchema);
