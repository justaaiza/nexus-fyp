const jwt = require('jsonwebtoken');
const userRepository = require('../../adapters/db/repositories/MongoUserRepository');

const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── Register ────────────────────────────────────────────────────────────────
const registerUser = async ({ name, email, password, role, rollNumber, department }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered.');
    err.statusCode = 409;
    throw err;
  }

  // Admin accounts are auto-approved; all others require coordinator approval
  const isApproved = role === 'admin';

  const user = await userRepository.create({
    name,
    email,
    password,
    role,
    rollNumber: rollNumber || null,
    department: department || null,
    isApproved,
  });

  const token = signToken(user._id, user.role);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved } };
};

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);  // includes password field
  if (!user) {
    const err = new Error('Invalid credentials.');
    err.statusCode = 401;
    throw err;
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    const err = new Error('Invalid credentials.');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isApproved && user.role !== 'admin') {
    const err = new Error('Your account is pending coordinator approval.');
    err.statusCode = 403;
    throw err;
  }

  const token = signToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rollNumber: user.rollNumber,
      department: user.department,
      isApproved: user.isApproved,
    },
  };
};

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { registerUser, loginUser, getMe };
