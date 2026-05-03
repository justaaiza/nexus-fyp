const AppError = require('../../utils/AppError');

/**
 * Use case: Get jury member's own profile.
 */
async function getProfile(userRepo, userId) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
}

module.exports = getProfile;
