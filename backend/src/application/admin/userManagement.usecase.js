const MongoUserRepository = require('../../adapters/db/repositories/MongoUserRepository');
const userRepository = new MongoUserRepository();

// ─── List All Users ───────────────────────────────────────────────────────────
const listUsers = async (filters = {}) => {
  return userRepository.findAll(filters);
};

// ─── Approve User ─────────────────────────────────────────────────────────────
const approveUser = async (userId) => {
  const user = await userRepository.updateById(userId, { isApproved: true });
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  return user;
};

// ─── Reject User ──────────────────────────────────────────────────────────────
const rejectUser = async (userId) => {
  const user = await userRepository.updateById(userId, { isApproved: false });
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  return user;
};

// ─── Delete User ──────────────────────────────────────────────────────────────
const deleteUser = async (userId) => {
  const user = await userRepository.deleteById(userId);
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });
};

module.exports = { listUsers, approveUser, rejectUser, deleteUser };
