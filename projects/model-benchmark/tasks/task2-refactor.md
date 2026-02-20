# Task 2: Refactoring (Express API Cleanup)

**Complexity:** Medium  
**Time Limit:** 5 minutes  
**Type:** Code refactoring

---

## Input File

`server.js` (messy monolithic code):
```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [];
let nextId = 1;

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  const user = { id: nextId++, name, email, createdAt: new Date() };
  users.push(user);
  res.status(201).json(user);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  user.name = name;
  user.email = email;
  user.updatedAt = new Date();
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Task

Refactor this monolithic Express API into clean, modular code.

**Requirements:**
1. **Separation of concerns:**
   - Routes → `routes/users.js`
   - Controllers → `controllers/userController.js`
   - Validation → `middleware/validate.js`
   - Data layer → `models/userModel.js` (in-memory store)
2. **Preserve all functionality** (GET, POST, PUT, DELETE)
3. **Improve code quality:**
   - Remove duplication
   - Extract validation logic
   - Use consistent error handling
4. **Maintain same API contract** (routes, status codes, responses)

**Deliverable:** Multiple files showing refactored structure + updated `server.js`

---

## Evaluation Criteria

- **Correctness (3 pts):** Does refactored code work? All routes functional?
- **Structure (4 pts):** Clean separation? Logical file organization?
- **Code Quality (3 pts):** DRY? Readable? Maintainable?

**Total:** /10 points
