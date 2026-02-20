const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  next();
};

module.exports = {
  validateUser
};
