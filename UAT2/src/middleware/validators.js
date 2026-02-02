const { body, query, param, validationResult } = require('express-validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

// Todo creation validation
const validateCreateTodo = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

// Todo update validation
const validateUpdateTodo = [
  param('id')
    .isUUID().withMessage('Invalid todo ID format'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be a boolean'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

// Todo query validation
const validateTodoQuery = [
  query('completed')
    .optional()
    .isBoolean().withMessage('Completed filter must be a boolean'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority filter must be low, medium, or high'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
    .toInt(),
  
  handleValidationErrors
];

// Todo ID validation
const validateTodoId = [
  param('id')
    .isUUID().withMessage('Invalid todo ID format'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoQuery,
  validateTodoId
};
