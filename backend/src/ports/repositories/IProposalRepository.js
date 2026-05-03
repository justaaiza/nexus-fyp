// ============================================================
// Port: IProposalRepository
// ============================================================

class IProposalRepository {
  async create(data) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async findAll(filters) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

module.exports = IProposalRepository;
