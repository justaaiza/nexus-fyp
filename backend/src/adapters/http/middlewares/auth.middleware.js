const jwt = require('jsonwebtoken');
const env = require('../../../config/env');
const AppError = require('../../../utils/AppError');
const MongoUserRepository = require('../../db/repositories/MongoUserRepository');

const userRepo = new MongoUserRepository();

/**
 * Middleware: verifyToken
 * Extracts and verifies the JWT from the Authorization header.
 * Attaches the full user object (without password) to req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await userRepo.findById(decoded.id);
    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired.', 401));
    }
    next(error);
  }
};

module.exports = verifyToken;
