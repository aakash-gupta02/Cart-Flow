import User from '../../src/models/user.model.js';
import bcrypt from 'bcrypt';

// Test helper functions
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };

  const user = { ...defaultUser, ...userData };
  
  // Hash password if provided
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  return await User.create(user);
};

export const clearDatabase = async () => {
  const collections = ['users'];
  
  for (const collection of collections) {
    await User.db.collection(collection).deleteMany({});
  }
};

export const generateValidUserData = (overrides = {}) => {
  return {
    name: 'John Doe',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    ...overrides
  };
};