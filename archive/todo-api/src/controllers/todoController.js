const db = require('../config/database');

class TodoController {
  // Create a new todo
  async createTodo(req, res) {
    const { title, description, status = 'pending', priority = 'medium', due_date } = req.body;

    const sql = `
      INSERT INTO todos (title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await db.run(sql, [title, description, status, priority, due_date]);
    const todo = await db.get('SELECT * FROM todos WHERE id = ?', [result.id]);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  }

  // Get all todos with optional filtering
  async getAllTodos(req, res) {
    const { status, priority, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM todos WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const todos = await db.all(sql, params);
    const countSql = 'SELECT COUNT(*) as total FROM todos WHERE 1=1' +
      (status ? ' AND status = ?' : '') +
      (priority ? ' AND priority = ?' : '');
    const countParams = [];
    if (status) countParams.push(status);
    if (priority) countParams.push(priority);
    const { total } = await db.get(countSql, countParams);

    res.status(200).json({
      success: true,
      data: todos,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: todos.length,
      },
    });
  }

  // Get a single todo by ID
  async getTodoById(req, res) {
    const { id } = req.params;

    const todo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  }

  // Update a todo
  async updateTodo(req, res) {
    const { id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    // Check if todo exists
    const existingTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    // Build dynamic update query
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
    await db.run(sql, params);

    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  }

  // Delete a todo
  async deleteTodo(req, res) {
    const { id } = req.params;

    const existingTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    await db.run('DELETE FROM todos WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  }

  // Get statistics
  async getStatistics(req, res) {
    const stats = await db.all(`
      SELECT 
        status,
        priority,
        COUNT(*) as count
      FROM todos
      GROUP BY status, priority
    `);

    const totalCount = await db.get('SELECT COUNT(*) as total FROM todos');
    const statusCounts = await db.all(`
      SELECT status, COUNT(*) as count
      FROM todos
      GROUP BY status
    `);
    const priorityCounts = await db.all(`
      SELECT priority, COUNT(*) as count
      FROM todos
      GROUP BY priority
    `);

    res.status(200).json({
      success: true,
      data: {
        total: totalCount.total,
        by_status: statusCounts.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        by_priority: priorityCounts.reduce((acc, item) => {
          acc[item.priority] = item.count;
          return acc;
        }, {}),
        detailed: stats,
      },
    });
  }
}

module.exports = new TodoController();
