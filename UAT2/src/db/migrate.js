const database = require('./database');

// Migration runner
function migrate() {
  try {
    console.log('Starting database migration...');
    database.connect();
    database.initialize();
    console.log('Migration completed successfully!');
    database.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
