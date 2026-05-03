const bcrypt = require('bcryptjs');
const AppError = require('../../utils/AppError');
const { isValidRole } = require('../../domain/rules/eligibilityRules');

/**
 * Use case: Register a new user.
 * New users are created with isApproved = false (pending admin approval).
 */
async function register(userRepo, { name, email, password, role, rollNumber, department }) {
  if (!isValidRole(role)) {
    throw new AppError('Invalid role specified.', 400);
  }

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepo.create({
    name,
    email,
    password: hashedPassword,
    role,
    rollNumber: rollNumber || null,
    department: department || null,
    isApproved: false,
  });

  return user;
}

module.exports = register;
