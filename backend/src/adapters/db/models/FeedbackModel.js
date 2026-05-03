const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
  },
  { timestamps: true }
);

/* One feedback per user per submission */
feedbackSchema.index({ submission: 1, givenBy: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
