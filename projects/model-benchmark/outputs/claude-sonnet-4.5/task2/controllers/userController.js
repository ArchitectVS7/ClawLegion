const userModel = require('../models/userModel');

const userController = {
  getAllUsers(req, res) {
    const users = userModel.getAll();
    res.json(users);
  },

  createUser(req, res) {
    const { name, email } = req.body;
    const user = userModel.create({ name, email });
    res.status(201).json(user);
  },

  getUserById(req, res) {
    const user = userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  },

  updateUser(req, res) {
    const { name, email } = req.body;
    const user = userModel.update(req.params.id, { name, email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  },

  deleteUser(req, res) {
    const deleted = userModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  }
};

module.exports = userController;
