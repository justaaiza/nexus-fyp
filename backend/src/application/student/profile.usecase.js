const MongoUserRepository = require('../../adapters/db/repositories/MongoUserRepository');
const userRepository = new MongoUserRepository();

// ─── Get Profile ──────────────────────────────────────────────────────────────
const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  return user;
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = async (userId, { name, rollNumber, department }) => {
  const updated = await userRepository.updateById(userId, { name, rollNumber, department });
  if (!updated) throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  return updated;
};

module.exports = { getProfile, updateProfile };
