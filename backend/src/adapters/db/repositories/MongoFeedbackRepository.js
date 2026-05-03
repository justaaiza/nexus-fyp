const IFeedbackRepository = require('../../../ports/repositories/IFeedbackRepository');
const FeedbackModel = require('../models/FeedbackModel');

class MongoFeedbackRepository extends IFeedbackRepository {
  async findById(id) {
    return FeedbackModel.findById(id)
      .populate('submission')
      .populate('givenBy', 'name email role')
      .lean();
  }

  async findBySubmission(submissionId) {
    return FeedbackModel.find({ submission: submissionId })
      .populate('givenBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findBySubmissionAndGiver(submissionId, giverId) {
    return FeedbackModel.findOne({ submission: submissionId, givenBy: giverId })
      .populate('givenBy', 'name email role')
      .lean();
  }

  async findByGivenBy(userId) {
    return FeedbackModel.find({ givenBy: userId })
      .populate({
        path: 'submission',
        populate: [
          { path: 'milestone', select: 'title deadline phase' },
          { path: 'submittedBy', select: 'name email rollNumber' },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(feedbackData) {
    const feedback = await FeedbackModel.create(feedbackData);
    return feedback.toObject();
  }

  async updateById(id, data) {
    return FeedbackModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('givenBy', 'name email role')
      .lean();
  }
}

module.exports = MongoFeedbackRepository;
