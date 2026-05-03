// ============================================================
// Port: IAnnouncementRepository
// ============================================================

class IAnnouncementRepository {
  async create(data) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
}

module.exports = IAnnouncementRepository;
