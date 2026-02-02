# API Usage Examples

## Quick Start

### 1. Create Your First Todo

```bash
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn REST APIs",
    "description": "Understand CRUD operations",
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Learn REST APIs",
    "description": "Understand CRUD operations",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "createdAt": "2026-02-02T20:03:00.000Z",
    "updatedAt": "2026-02-02T20:03:00.000Z"
  }
}
```

### 2. Get All Todos

```bash
curl http://localhost:3000/api/v1/todos
```

### 3. Update Todo (Mark as Complete)

```bash
curl -X PATCH http://localhost:3000/api/v1/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### 4. Delete Todo

```bash
curl -X DELETE http://localhost:3000/api/v1/todos/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Advanced Queries

### Filter by Priority

```bash
# Get only high priority todos
curl "http://localhost:3000/api/v1/todos?priority=high"

# Get only low priority todos
curl "http://localhost:3000/api/v1/todos?priority=low"
```

### Filter by Completion Status

```bash
# Get only incomplete todos
curl "http://localhost:3000/api/v1/todos?completed=false"

# Get only completed todos
curl "http://localhost:3000/api/v1/todos?completed=true"
```

### Combined Filters

```bash
# Get incomplete high-priority todos
curl "http://localhost:3000/api/v1/todos?completed=false&priority=high"
```

### Pagination

```bash
# Get first 10 todos
curl "http://localhost:3000/api/v1/todos?limit=10&offset=0"

# Get next 10 todos
curl "http://localhost:3000/api/v1/todos?limit=10&offset=10"
```

## JavaScript/TypeScript Examples

### Using Fetch API

```javascript
// Create todo
async function createTodo(title, description, priority = 'medium') {
  const response = await fetch('http://localhost:3000/api/v1/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, priority })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
}

// Get all todos
async function getTodos(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3000/api/v1/todos?${params}`);
  const data = await response.json();
  return data.data.todos;
}

// Update todo
async function updateTodo(id, updates) {
  const response = await fetch(`http://localhost:3000/api/v1/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });
  
  const data = await response.json();
  return data.data;
}

// Delete todo
async function deleteTodo(id) {
  const response = await fetch(`http://localhost:3000/api/v1/todos/${id}`, {
    method: 'DELETE'
  });
  
  const data = await response.json();
  return data.success;
}

// Usage examples
const todo = await createTodo('Buy milk', 'Get 2% milk from store', 'high');
const allTodos = await getTodos({ completed: false });
await updateTodo(todo.id, { completed: true });
await deleteTodo(todo.id);
```

### Using Axios

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create
const { data: { data: todo } } = await api.post('/todos', {
  title: 'New task',
  priority: 'high'
});

// Read all
const { data: { data: { todos } } } = await api.get('/todos');

// Read one
const { data: { data: singleTodo } } = await api.get(`/todos/${todo.id}`);

// Update
const { data: { data: updated } } = await api.patch(`/todos/${todo.id}`, {
  completed: true
});

// Delete
await api.delete(`/todos/${todo.id}`);
```

## Python Examples

```python
import requests

BASE_URL = "http://localhost:3000/api/v1"

# Create todo
def create_todo(title, description="", priority="medium"):
    response = requests.post(
        f"{BASE_URL}/todos",
        json={
            "title": title,
            "description": description,
            "priority": priority
        }
    )
    return response.json()["data"]

# Get all todos
def get_todos(completed=None, priority=None):
    params = {}
    if completed is not None:
        params["completed"] = str(completed).lower()
    if priority:
        params["priority"] = priority
    
    response = requests.get(f"{BASE_URL}/todos", params=params)
    return response.json()["data"]["todos"]

# Update todo
def update_todo(todo_id, **updates):
    response = requests.patch(
        f"{BASE_URL}/todos/{todo_id}",
        json=updates
    )
    return response.json()["data"]

# Delete todo
def delete_todo(todo_id):
    response = requests.delete(f"{BASE_URL}/todos/{todo_id}")
    return response.json()["success"]

# Usage
todo = create_todo("Python task", priority="high")
todos = get_todos(completed=False, priority="high")
updated = update_todo(todo["id"], completed=True)
deleted = delete_todo(todo["id"])
```

## Error Handling Examples

### JavaScript

```javascript
async function safeFetchTodo(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/todos/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      if (response.status === 404) {
        console.error('Todo not found');
      } else if (response.status === 400) {
        console.error('Validation error:', data.details);
      } else {
        console.error('Error:', data.error);
      }
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

### Python

```python
def safe_create_todo(title, **kwargs):
    try:
        response = requests.post(
            f"{BASE_URL}/todos",
            json={"title": title, **kwargs}
        )
        data = response.json()
        
        if not data["success"]:
            if response.status_code == 400:
                print("Validation errors:")
                for detail in data.get("details", []):
                    print(f"  - {detail['field']}: {detail['message']}")
            else:
                print(f"Error: {data['error']}")
            return None
        
        return data["data"]
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None
```

## Complete Workflow Example

```bash
# 1. Create multiple todos
TODO1=$(curl -s -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Morning workout","priority":"high"}' | jq -r '.data.id')

TODO2=$(curl -s -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Team meeting","priority":"medium"}' | jq -r '.data.id')

TODO3=$(curl -s -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Code review","priority":"high"}' | jq -r '.data.id')

# 2. View all todos
curl -s http://localhost:3000/api/v1/todos | jq '.data.todos'

# 3. Complete the workout
curl -s -X PATCH http://localhost:3000/api/v1/todos/$TODO1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}' | jq .

# 4. Get only incomplete high-priority tasks
curl -s "http://localhost:3000/api/v1/todos?completed=false&priority=high" | jq '.data.todos'

# 5. Delete completed tasks
curl -s -X DELETE http://localhost:3000/api/v1/todos/$TODO1 | jq .
```
