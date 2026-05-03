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
      required: [true, 'Feedback comment is required'],
    },
    grade: {
      type: Number,
      default: null,
    },
    rubric: [
      {
        criteria: String,
        score: Number,
        max: Number,
        comment: String,
      },
    ],
    overallFeedback: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
