const IFeedbackRepository = require('../../../ports/repositories/IFeedbackRepository');
const FeedbackModel = require('../models/FeedbackModel');
const SubmissionModel = require('../models/SubmissionModel');

class MongoFeedbackRepository extends IFeedbackRepository {
  async create(data) {
    return FeedbackModel.create(data);
  }

  async findBySubmissionId(submissionId) {
    return FeedbackModel.find({ submission: submissionId })
      .populate('givenBy', 'name email role')
      .sort({ createdAt: -1 });
  }

  /**
   * Find all feedback for submissions that belong to a specific user.
   */
  async findByUserId(userId) {
    // 1. Find submissions by user
    const submissions = await SubmissionModel.find({ submittedBy: userId })
      .populate('milestone', 'title deadline phase description');

    const submissionIds = submissions.map((s) => s._id);

    // 2. Find feedback for those submissions
    const feedbackList = await FeedbackModel.find({ submission: { $in: submissionIds } })
      .populate({ path: 'submission', populate: { path: 'milestone', select: 'title deadline phase' } })
      .populate('givenBy', 'name email role')
      .sort({ createdAt: -1 });

    return feedbackList;
  }

  async findAll(filters = {}) {
    return FeedbackModel.find(filters)
      .populate('submission')
      .populate('givenBy', 'name email role')
      .sort({ createdAt: -1 });
  }
}

module.exports = new MongoFeedbackRepository();
