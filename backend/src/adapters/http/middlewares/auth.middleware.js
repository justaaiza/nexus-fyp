const jwt = require('jsonwebtoken');
const userRepository = require('../../../adapters/db/repositories/MongoUserRepository');

/**
 * verifyToken — Validates JWT from Authorization header.
 * Attaches `req.user` with { id, role } on success.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is no longer valid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
