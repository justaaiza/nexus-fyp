const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');

/**
 * Use case: Login user and return a JWT.
 */
async function login(userRepo, { email, password }) {
  const user = await userRepo.findByEmailWithPassword(email);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isApproved) {
    throw new AppError('Your account is pending admin approval.', 403);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
}

module.exports = login;
