const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audience: {
      type: String,
      enum: ['all', 'students', 'supervisors', 'jury'],
      default: 'all',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success'],
      default: 'info',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
