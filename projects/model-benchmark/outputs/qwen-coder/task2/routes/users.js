const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');

// GET /users - Get all users
router.get('/', UserController.getAllUsers);

// GET /users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// POST /users - Create new user
router.post('/', validateUser, UserController.createUser);

// PUT /users/:id - Update user
router.put('/:id', validateUser, UserController.updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
