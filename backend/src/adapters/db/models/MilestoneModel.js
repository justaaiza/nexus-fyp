const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    phase: {
      type: String,
      enum: ['FYP-1', 'FYP-2'],
      required: [true, 'Phase is required'],
    },
    type: {
      type: String,
      enum: ['document', 'defence', 'code'],
      required: [true, 'Type is required'],
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
