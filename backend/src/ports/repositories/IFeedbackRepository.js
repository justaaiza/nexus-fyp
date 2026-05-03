/**
 * Port: Feedback repository interface.
 */
class IFeedbackRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findBySubmission(submissionId) { throw new Error('Not implemented'); }
  async findBySubmissionAndGiver(submissionId, giverId) { throw new Error('Not implemented'); }
  async findByGivenBy(userId) { throw new Error('Not implemented'); }
  async create(feedbackData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
}

module.exports = IFeedbackRepository;
