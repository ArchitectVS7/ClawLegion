# Quick Start Guide

## Installation (1 minute)

```bash
cd todo-api
npm install
```

## Start Server (immediately)

```bash
npm start
# Server runs on http://localhost:3000
```

## Test It (30 seconds)

Open another terminal:
```bash
cd todo-api
npm test
```

Expected output: **✅ 13 tests passed**

## Try It Out

### Create a Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Todo",
    "description": "Learning the API",
    "priority": "high"
  }'
```

### Get All Todos
```bash
curl http://localhost:3000/api/todos
```

### Update a Todo
```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Get Statistics
```bash
curl http://localhost:3000/api/todos/stats
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Next Steps

1. Read **README.md** for complete API documentation
2. Import **POSTMAN_COLLECTION.json** into Postman for easy testing
3. Check **DEPLOYMENT.md** for production deployment
4. Review **PROJECT_SUMMARY.md** for technical details

## Using with Your Frontend

```javascript
// Example: Fetch todos
fetch('http://localhost:3000/api/todos')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Example: Create todo
fetch('http://localhost:3000/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    priority: 'medium'
  })
})
.then(res => res.json())
.then(data => console.log(data.data));
```

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm start
```

**Need to reset database?**
```bash
rm -rf data/
npm start  # Will recreate automatically
```

**Tests failing?**
Make sure server is running first!

---

**That's it!** You now have a fully functional REST API. 🚀
