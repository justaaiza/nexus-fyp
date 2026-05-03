/**
 * Port: Panel repository interface.
 */
class IPanelRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findAll(filter) { throw new Error('Not implemented'); }
  async findByJuryMember(userId) { throw new Error('Not implemented'); }
  async create(panelData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
}

module.exports = IPanelRepository;
