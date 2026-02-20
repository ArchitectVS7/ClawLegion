let users = [];
let nextId = 1;

const getAllUsers = () => {
  return users;
};

const createUser = (name, email) => {
  const user = {
    id: nextId++,
    name,
    email,
    createdAt: new Date()
  };
  users.push(user);
  return user;
};

const getUserById = (id) => {
  return users.find(u => u.id === id);
};

const updateUser = (id, name, email) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    return null;
  }
  user.name = name;
  user.email = email;
  user.updatedAt = new Date();
  return user;
};

const deleteUser = (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  return true;
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
