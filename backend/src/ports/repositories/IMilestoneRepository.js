/**
 * Port: Milestone repository interface.
 */
class IMilestoneRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findAll(filter) { throw new Error('Not implemented'); }
  async findByCreatedBy(supervisorId) { throw new Error('Not implemented'); }
  async findByAssignedTo(userId) { throw new Error('Not implemented'); }
  async create(milestoneData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
}

module.exports = IMilestoneRepository;
