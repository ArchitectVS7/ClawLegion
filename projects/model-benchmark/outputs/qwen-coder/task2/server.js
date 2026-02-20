const express = require('express');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
