// ============================================================
// Port: IUserRepository
// Defines the contract any User data adapter must implement.
// ============================================================

/**
 * @interface IUserRepository
 *
 * All methods are async and resolve to domain User entities
 * (or arrays of them, or null).
 *
 * Adapters:
 *  - adapters/db/repositories/MongoUserRepository.js
 */
class IUserRepository {
  /** @returns {Promise<User>} */
  async create(data) { throw new Error('Not implemented'); }

  /** @returns {Promise<User|null>} */
  async findById(id) { throw new Error('Not implemented'); }

  /** @returns {Promise<User|null>} */
  async findByEmail(email) { throw new Error('Not implemented'); }

  /** @returns {Promise<User[]>} */
  async findAll(filters) { throw new Error('Not implemented'); }

  /** @returns {Promise<User>} */
  async update(id, data) { throw new Error('Not implemented'); }

  /** @returns {Promise<void>} */
  async delete(id) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
