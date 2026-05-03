const AppError = require('../../utils/AppError');

/**
 * Use case: Update supervisor's own profile.
 */
async function updateProfile(userRepo, { userId, updateData }) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const updated = await userRepo.updateById(userId, updateData);
  return updated;
}

module.exports = updateProfile;
