const UserModel = require('../models/userModel');

class UserController {
  // GET /users - Get all users
  static getAllUsers(req, res) {
    const users = UserModel.getAll();
    res.json(users);
  }

  // GET /users/:id - Get user by ID
  static getUserById(req, res) {
    const user = UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  }

  // POST /users - Create new user
  static createUser(req, res) {
    const { name, email } = req.body;
    const user = UserModel.create({ name, email });
    res.status(201).json(user);
  }

  // PUT /users/:id - Update user
  static updateUser(req, res) {
    const { name, email } = req.body;
    const user = UserModel.update(req.params.id, { name, email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  }

  // DELETE /users/:id - Delete user
  static deleteUser(req, res) {
    const deleted = UserModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  }
}

module.exports = UserController;
