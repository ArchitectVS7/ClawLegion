const { v4: uuidv4 } = require('uuid');
const database = require('../db/database');

class Todo {
  static create({ title, description, priority = 'medium', due_date = null }) {
    const db = database.getConnection();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO todos (id, title, description, priority, due_date, completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `);

    try {
      stmt.run(id, title, description, priority, due_date, now, now);
      return this.findById(id);
    } catch (error) {
      throw new Error('Failed to create todo: ' + error.message);
    }
  }

  static findAll({ completed = null, priority = null, limit = 100, offset = 0 } = {}) {
    const db = database.getConnection();
    let query = 'SELECT * FROM todos WHERE 1=1';
    const params = [];

    if (completed !== null) {
      query += ' AND completed = ?';
      params.push(completed ? 1 : 0);
    }

    if (priority !== null) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const todos = stmt.all(...params);

    return todos.map(this._formatTodo);
  }

  static findById(id) {
    const db = database.getConnection();
    const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
    const todo = stmt.get(id);

    if (!todo) {
      return null;
    }

    return this._formatTodo(todo);
  }

  static update(id, updates) {
    const db = database.getConnection();
    const allowedFields = ['title', 'description', 'completed', 'priority', 'due_date'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);

    try {
      const result = stmt.run(...values);
      
      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw new Error('Failed to update todo: ' + error.message);
    }
  }

  static delete(id) {
    const db = database.getConnection();
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    
    try {
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      throw new Error('Failed to delete todo: ' + error.message);
    }
  }

  static count({ completed = null } = {}) {
    const db = database.getConnection();
    let query = 'SELECT COUNT(*) as count FROM todos';
    const params = [];

    if (completed !== null) {
      query += ' WHERE completed = ?';
      params.push(completed ? 1 : 0);
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);
    return result.count;
  }

  static _formatTodo(todo) {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: Boolean(todo.completed),
      priority: todo.priority,
      dueDate: todo.due_date,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at
    };
  }
}

module.exports = Todo;
