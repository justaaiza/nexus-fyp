/**
 * Port: Submission repository interface.
 */
class ISubmissionRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findAll(filter) { throw new Error('Not implemented'); }
  async findBySubmittedBy(userId) { throw new Error('Not implemented'); }
  async findByMilestone(milestoneId) { throw new Error('Not implemented'); }
  async findByMultipleUsers(userIds) { throw new Error('Not implemented'); }
  async create(submissionData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
}

module.exports = ISubmissionRepository;
