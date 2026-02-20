const express = require('express');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
