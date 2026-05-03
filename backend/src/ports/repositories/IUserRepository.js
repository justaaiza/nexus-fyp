/**
 * Port: User repository interface.
 * Concrete implementations must extend this class and implement all methods.
 */
class IUserRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByIdWithPassword(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async findByEmailWithPassword(email) { throw new Error('Not implemented'); }
  async findAll(filter) { throw new Error('Not implemented'); }
  async create(userData) { throw new Error('Not implemented'); }
  async updateById(id, data) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
  async countByFilter(filter) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
