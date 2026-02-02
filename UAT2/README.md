# Todo List REST API

A production-ready REST API for managing todo items with full CRUD operations, built with Node.js, Express, and SQLite.

## Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete todos  
✅ **Input Validation** - Comprehensive request validation with detailed error messages  
✅ **Error Handling** - Robust error handling with meaningful responses  
✅ **Filtering & Pagination** - Query todos by status, priority with pagination support  
✅ **Security** - Helmet.js, CORS, input sanitization  
✅ **Production Ready** - Compression, logging, graceful shutdown  
✅ **Database** - SQLite with WAL mode for better concurrency  
✅ **API Documentation** - Clear endpoint documentation

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite3 (better-sqlite3)
- **Validation:** express-validator
- **Security:** Helmet, CORS
- **Logging:** Morgan

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Initialize database
npm run migrate

# Start development server
npm run dev

# Or start production server
npm start
```

## Database Schema

```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,              -- UUID
  title TEXT NOT NULL,              -- Max 200 chars
  description TEXT,                 -- Max 1000 chars
  completed BOOLEAN DEFAULT 0,      -- true/false
  priority TEXT DEFAULT 'medium',   -- low/medium/high
  due_date TEXT,                    -- ISO 8601 format
  created_at TEXT NOT NULL,         -- ISO 8601 timestamp
  updated_at TEXT NOT NULL          -- ISO 8601 timestamp
);
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```http
GET /health
```

### Get All Todos
```http
GET /api/v1/todos
```

**Query Parameters:**
- `completed` (boolean) - Filter by completion status
- `priority` (string) - Filter by priority: `low`, `medium`, `high`
- `limit` (number) - Results per page (1-100, default: 100)
- `offset` (number) - Skip results (default: 0)

**Example:**
```bash
curl "http://localhost:3000/api/v1/todos?completed=false&priority=high&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Complete API documentation",
        "description": "Write comprehensive API docs",
        "completed": false,
        "priority": "high",
        "dueDate": "2026-02-10T00:00:00.000Z",
        "createdAt": "2026-02-02T20:00:00.000Z",
        "updatedAt": "2026-02-02T20:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### Get Single Todo
```http
GET /api/v1/todos/:id
```

**Example:**
```bash
curl http://localhost:3000/api/v1/todos/123e4567-e89b-12d3-a456-426614174000
```

### Create Todo
```http
POST /api/v1/todos
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API implementation",
  "priority": "high",
  "dueDate": "2026-02-10T00:00:00.000Z"
}
```

**Required Fields:**
- `title` (string, 1-200 chars)

**Optional Fields:**
- `description` (string, max 1000 chars)
- `priority` (string: `low`, `medium`, `high`)
- `dueDate` (ISO 8601 date string)

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium",
    "dueDate": "2026-02-03T18:00:00.000Z"
  }'
```

### Update Todo
```http
PATCH /api/v1/todos/:id
Content-Type: application/json

{
  "completed": true,
  "priority": "low"
}
```

**All fields are optional:**
- `title` (string, 1-200 chars)
- `description` (string, max 1000 chars)
- `completed` (boolean)
- `priority` (string: `low`, `medium`, `high`)
- `dueDate` (ISO 8601 date string)

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/v1/todos/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Todo
```http
DELETE /api/v1/todos/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/todos/123e4567-e89b-12d3-a456-426614174000
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Validation errors include details:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required",
      "value": ""
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_PATH=./data/todos.db

# API
API_VERSION=v1

# CORS
CORS_ORIGIN=*
```

## Testing the API

### Using cURL

```bash
# Create a todo
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo","priority":"high"}'

# Get all todos
curl http://localhost:3000/api/v1/todos

# Get filtered todos
curl "http://localhost:3000/api/v1/todos?completed=false&priority=high"

# Update a todo
curl -X PATCH http://localhost:3000/api/v1/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/v1/todos/{id}
```

### Using JavaScript (fetch)

```javascript
// Create
const response = await fetch('http://localhost:3000/api/v1/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New task',
    description: 'Task details',
    priority: 'high'
  })
});
const data = await response.json();

// Get all
const todos = await fetch('http://localhost:3000/api/v1/todos')
  .then(r => r.json());

// Update
await fetch(`http://localhost:3000/api/v1/todos/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed: true })
});

// Delete
await fetch(`http://localhost:3000/api/v1/todos/${id}`, {
  method: 'DELETE'
});
```

## Production Deployment

### Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use PostgreSQL or MySQL for production
3. **Logging**: Integrate with logging service (e.g., Winston, Loggly)
4. **Monitoring**: Add APM tools (e.g., New Relic, Datadog)
5. **Rate Limiting**: Implement rate limiting for public APIs
6. **Authentication**: Add JWT or OAuth for protected routes
7. **HTTPS**: Always use HTTPS in production
8. **Process Manager**: Use PM2 or similar for process management

### PM2 Deployment

```bash
npm install -g pm2

# Start
pm2 start src/server.js --name todo-api

# Monitor
pm2 monit

# Logs
pm2 logs todo-api

# Restart
pm2 restart todo-api
```

## Project Structure

```
todo-api/
├── src/
│   ├── config/
│   │   └── index.js          # Configuration management
│   ├── db/
│   │   ├── database.js       # Database connection & setup
│   │   └── migrate.js        # Migration runner
│   ├── middleware/
│   │   ├── errorHandler.js   # Error handling middleware
│   │   └── validators.js     # Request validation
│   ├── models/
│   │   └── Todo.js           # Todo model with data access
│   ├── routes/
│   │   └── todos.js          # Todo route handlers
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── data/                     # SQLite database files
├── .env.example              # Environment template
├── .gitignore
├── package.json
└── README.md
```

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
