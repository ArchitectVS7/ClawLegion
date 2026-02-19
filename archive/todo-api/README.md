# Todo List REST API

A production-ready REST API for managing todo items with full CRUD operations, validation, error handling, and filtering capabilities.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling
- ✅ SQLite database with proper schema
- ✅ Query filtering and pagination
- ✅ Statistics endpoint
- ✅ Security headers (Helmet.js)
- ✅ CORS support
- ✅ Graceful shutdown handling
- ✅ Health check endpoint
- ✅ Production-ready configuration

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Validation:** express-validator
- **Security:** Helmet, CORS

## Installation

```bash
cd todo-api
npm install
```

## Configuration

Create a `.env` file (already provided):

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/todos.db
```

## Running the API

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Running Tests

```bash
# Start the server in one terminal
npm start

# Run tests in another terminal
npm test
```

## API Schema

### Todo Object

```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2026-12-31T23:59:59Z",
  "created_at": "2026-02-02T20:53:00Z",
  "updated_at": "2026-02-02T21:00:00Z"
}
```

### Field Constraints

- **title** (required): 1-200 characters
- **description** (optional): max 1000 characters
- **status** (optional): `pending` | `in_progress` | `completed` (default: `pending`)
- **priority** (optional): `low` | `medium` | `high` (default: `medium`)
- **due_date** (optional): ISO 8601 date format
- **created_at** (auto): ISO 8601 timestamp
- **updated_at** (auto): ISO 8601 timestamp

## API Endpoints

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-02T20:53:00Z"
}
```

---

### Create Todo

**POST** `/api/todos`

Create a new todo item.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high",
  "due_date": "2026-02-05T18:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "priority": "high",
    "due_date": "2026-02-05T18:00:00Z",
    "created_at": "2026-02-02T20:53:00Z",
    "updated_at": "2026-02-02T20:53:00Z"
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

### Get All Todos

**GET** `/api/todos`

Retrieve all todos with optional filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in_progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `limit` (optional): Number of results (1-100, default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Examples:**
```
GET /api/todos
GET /api/todos?status=pending
GET /api/todos?priority=high&limit=10
GET /api/todos?status=in_progress&offset=20
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "status": "pending",
      "priority": "high",
      ...
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0,
    "count": 42
  }
}
```

---

### Get Todo by ID

**GET** `/api/todos/:id`

Retrieve a single todo by its ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    ...
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Todo not found"
}
```

---

### Update Todo (Full)

**PUT** `/api/todos/:id`

Replace all fields of a todo (except id and timestamps).

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "due_date": "2026-02-10T12:00:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "title": "Updated title",
    ...
    "updated_at": "2026-02-02T21:30:00Z"
  }
}
```

---

### Update Todo (Partial)

**PATCH** `/api/todos/:id`

Update specific fields of a todo.

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "status": "completed",
    ...
  }
}
```

---

### Delete Todo

**DELETE** `/api/todos/:id`

Delete a todo permanently.

**Response (200):**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Todo not found"
}
```

---

### Get Statistics

**GET** `/api/todos/stats`

Get aggregated statistics about todos.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "by_status": {
      "pending": 5,
      "in_progress": 7,
      "completed": 3
    },
    "by_priority": {
      "low": 4,
      "medium": 6,
      "high": 5
    },
    "detailed": [
      { "status": "pending", "priority": "high", "count": 2 },
      ...
    ]
  }
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "details": [] // Optional validation details
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure `ALLOWED_ORIGINS` for CORS
- [ ] Use a reverse proxy (nginx, Apache)
- [ ] Enable HTTPS/TLS
- [ ] Set up proper logging (Winston, Morgan)
- [ ] Configure database backups
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Use a production-grade database (PostgreSQL, MySQL)

## Database Schema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
  due_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status ON todos(status);
CREATE INDEX idx_priority ON todos(priority);
CREATE INDEX idx_due_date ON todos(due_date);
```

## Testing with cURL

```bash
# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","priority":"high"}'

# Get all todos
curl http://localhost:3000/api/todos

# Get filtered todos
curl "http://localhost:3000/api/todos?status=pending&priority=high"

# Get single todo
curl http://localhost:3000/api/todos/1

# Update todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","status":"completed"}'

# Partial update
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'

# Delete todo
curl -X DELETE http://localhost:3000/api/todos/1

# Get statistics
curl http://localhost:3000/api/todos/stats
```

## License

MIT
