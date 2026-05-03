const AppError = require('../../utils/AppError');

/**
 * Use case: Get current authenticated user's profile.
 */
async function getMe(userRepo, userId) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
}

module.exports = getMe;
