/**
 * Port: Proposal repository interface.
 */
class IProposalRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findAll(filter) { throw new Error('Not implemented'); }
  async findBySupervisorPreference(supervisorId) { throw new Error('Not implemented'); }
  async findBySubmittedBy(userId) { throw new Error('Not implemented'); }
  async create(proposalData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
  async countByFilter(filter) { throw new Error('Not implemented'); }
}

module.exports = IProposalRepository;
