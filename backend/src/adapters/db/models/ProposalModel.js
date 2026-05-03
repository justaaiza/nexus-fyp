const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
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
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    supervisorPreference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    domain: {
      type: String,
      default: null,
    },
    techStack: {
      type: [String],
      default: [],
    },
    groupNo: {
      type: String,
      default: null,
    },
    repoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposal', proposalSchema);

