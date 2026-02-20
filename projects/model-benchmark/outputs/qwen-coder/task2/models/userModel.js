// In-memory data store
let users = [];
let nextId = 1;

class UserModel {
  static getAll() {
    return users;
  }

  static findById(id) {
    return users.find(u => u.id === parseInt(id));
  }

  static create(userData) {
    const user = {
      id: nextId++,
      name: userData.name,
      email: userData.email,
      createdAt: new Date()
    };
    users.push(user);
    return user;
  }

  static update(id, userData) {
    const user = this.findById(id);
    if (!user) {
      return null;
    }
    user.name = userData.name;
    user.email = userData.email;
    user.updatedAt = new Date();
    return user;
  }

  static delete(id) {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
      return false;
    }
    users.splice(index, 1);
    return true;
  }
}

module.exports = UserModel;
