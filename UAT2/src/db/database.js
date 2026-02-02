const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config');

class TodoDatabase {
  constructor() {
    this.db = null;
  }

  connect() {
    try {
      // Ensure data directory exists
      const dbDir = path.dirname(config.database.path);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new Database(config.database.path);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      
      console.log('Database connected successfully');
      return this;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  initialize() {
    const schema = `
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        due_date TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
      CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
      CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
    `;

    try {
      this.db.exec(schema);
      console.log('Database schema initialized');
    } catch (error) {
      console.error('Schema initialization error:', error);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log('Database connection closed');
    }
  }

  getConnection() {
    return this.db;
  }
}

module.exports = new TodoDatabase();
