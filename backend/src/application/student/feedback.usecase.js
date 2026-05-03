const MongoFeedbackRepository = require('../../adapters/db/repositories/MongoFeedbackRepository');
const feedbackRepository = new MongoFeedbackRepository();

const MongoSubmissionRepository = require('../../adapters/db/repositories/MongoSubmissionRepository');
const submissionRepository = new MongoSubmissionRepository();

// ─── Get My Feedback ─────────────────────────────────────────────────────────
const getMyFeedback = async (studentId) => {
  const submissions = await submissionRepository.findBySubmittedBy(studentId);
  if (!submissions || submissions.length === 0) return [];
  
  const subIds = submissions.map(s => s._id);
  // Using Mongoose directly for this specific query to avoid adding methods
  const FeedbackModel = require('../../adapters/db/models/FeedbackModel');
  return FeedbackModel.find({ submission: { $in: subIds } })
    .populate({
      path: 'submission',
      populate: { path: 'milestone', select: 'title' }
    })
    .populate('givenBy', 'name email role')
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = { getMyFeedback };
