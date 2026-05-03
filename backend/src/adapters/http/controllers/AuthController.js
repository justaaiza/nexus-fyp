const MongoUserRepository = require('../../db/repositories/MongoUserRepository');
const register = require('../../../application/auth/register.usecase');
const login = require('../../../application/auth/login.usecase');
const getMe = require('../../../application/auth/getMe.usecase');

const userRepo = new MongoUserRepository();

class AuthController {
  async register(req, res, next) {
    try {
      const user = await register(userRepo, req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await login(userRepo, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await getMe(userRepo, req.user._id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
