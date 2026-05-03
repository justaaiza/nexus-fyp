const feedbackRepository = require('../../adapters/db/repositories/MongoFeedbackRepository');

// ─── Get My Feedback ─────────────────────────────────────────────────────────
const getMyFeedback = async (studentId) => {
  return feedbackRepository.findByUserId(studentId);
};

module.exports = { getMyFeedback };
