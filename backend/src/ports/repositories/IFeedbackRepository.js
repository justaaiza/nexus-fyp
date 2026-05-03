// ============================================================
// Port: IFeedbackRepository
// ============================================================

class IFeedbackRepository {
  async create(data) { throw new Error('Not implemented'); }
  async findBySubmissionId(submissionId) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async findAll(filters) { throw new Error('Not implemented'); }
}

module.exports = IFeedbackRepository;
