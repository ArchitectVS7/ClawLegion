const userModel = require('../models/userModel');

const getAllUsers = (req, res) => {
  const users = userModel.getAllUsers();
  res.json(users);
};

const createUser = (req, res) => {
  const { name, email } = req.body;
  const user = userModel.createUser(name, email);
  res.status(201).json(user);
};

const getUserById = (req, res) => {
  const user = userModel.getUserById(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

const updateUser = (req, res) => {
  const { name, email } = req.body;
  const user = userModel.updateUser(parseInt(req.params.id), name, email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

const deleteUser = (req, res) => {
  const success = userModel.deleteUser(parseInt(req.params.id));
  if (!success) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
