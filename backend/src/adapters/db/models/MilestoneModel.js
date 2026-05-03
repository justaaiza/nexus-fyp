const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Milestone description is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    phase: {
      type: String,
      enum: ['FYP-1', 'FYP-2'],
      default: 'FYP-1',
    },
    acceptedTypes: {
      type: [String],
      default: ['pdf'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
