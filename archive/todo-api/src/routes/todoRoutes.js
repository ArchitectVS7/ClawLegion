const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  createTodoValidation,
  updateTodoValidation,
  idValidation,
  queryValidation,
  handleValidationErrors,
} = require('../middleware/validator');

// Statistics endpoint
router.get(
  '/stats',
  asyncHandler(todoController.getStatistics.bind(todoController))
);

// Create a new todo
router.post(
  '/',
  createTodoValidation,
  handleValidationErrors,
  asyncHandler(todoController.createTodo.bind(todoController))
);

// Get all todos
router.get(
  '/',
  queryValidation,
  handleValidationErrors,
  asyncHandler(todoController.getAllTodos.bind(todoController))
);

// Get a single todo
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  asyncHandler(todoController.getTodoById.bind(todoController))
);

// Update a todo
router.put(
  '/:id',
  updateTodoValidation,
  handleValidationErrors,
  asyncHandler(todoController.updateTodo.bind(todoController))
);

// Partial update (PATCH)
router.patch(
  '/:id',
  updateTodoValidation,
  handleValidationErrors,
  asyncHandler(todoController.updateTodo.bind(todoController))
);

// Delete a todo
router.delete(
  '/:id',
  idValidation,
  handleValidationErrors,
  asyncHandler(todoController.deleteTodo.bind(todoController))
);

module.exports = router;
