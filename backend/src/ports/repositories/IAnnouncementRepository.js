/**
 * Port: Announcement repository interface.
 */
class IAnnouncementRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findAll(filter) { throw new Error('Not implemented'); }
  async create(announcementData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
}

module.exports = IAnnouncementRepository;
