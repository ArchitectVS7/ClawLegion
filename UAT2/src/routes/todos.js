const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoQuery,
  validateTodoId
} = require('../middleware/validators');

/**
 * @route   GET /api/v1/todos
 * @desc    Get all todos with optional filters
 * @access  Public
 */
router.get('/', validateTodoQuery, asyncHandler(async (req, res) => {
  const { completed, priority, limit = 100, offset = 0 } = req.query;

  const filters = {};
  
  if (completed !== undefined) {
    filters.completed = completed === 'true';
  }
  
  if (priority) {
    filters.priority = priority;
  }

  filters.limit = parseInt(limit);
  filters.offset = parseInt(offset);

  const todos = Todo.findAll(filters);
  const total = Todo.count({ completed: filters.completed });

  res.json({
    success: true,
    data: {
      todos,
      pagination: {
        total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: (filters.offset + filters.limit) < total
      }
    }
  });
}));

/**
 * @route   GET /api/v1/todos/:id
 * @desc    Get a single todo by ID
 * @access  Public
 */
router.get('/:id', validateTodoId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = Todo.findById(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }

  res.json({
    success: true,
    data: todo
  });
}));

/**
 * @route   POST /api/v1/todos
 * @desc    Create a new todo
 * @access  Public
 */
router.post('/', validateCreateTodo, asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const todo = Todo.create({
    title,
    description,
    priority,
    due_date: dueDate
  });

  res.status(201).json({
    success: true,
    data: todo
  });
}));

/**
 * @route   PATCH /api/v1/todos/:id
 * @desc    Update a todo
 * @access  Public
 */
router.patch('/:id', validateUpdateTodo, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority, dueDate } = req.body;

  const updates = {};
  
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (completed !== undefined) updates.completed = completed ? 1 : 0;
  if (priority !== undefined) updates.priority = priority;
  if (dueDate !== undefined) updates.due_date = dueDate;

  const todo = Todo.update(id, updates);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }

  res.json({
    success: true,
    data: todo
  });
}));

/**
 * @route   DELETE /api/v1/todos/:id
 * @desc    Delete a todo
 * @access  Public
 */
router.delete('/:id', validateTodoId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = Todo.delete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }

  res.json({
    success: true,
    message: 'Todo deleted successfully'
  });
}));

module.exports = router;
