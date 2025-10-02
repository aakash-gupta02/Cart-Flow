import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import bcrypt from 'bcrypt';

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  };

  describe('Successful registration', () => {
    test('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User Registered Successfully');
      expect(response.body).toHaveProperty('user');
      
      const { user } = response.body;
      expect(user).toHaveProperty('name', validUser.name);
      expect(user).toHaveProperty('email', validUser.email);
      expect(user).not.toHaveProperty('password'); // Password should not be in response
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      expect(user).toHaveProperty('_id');
    });

    test('should create user successfully with all required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User Registered Successfully');
      
      const savedUser = await User.findOne({ email: validUser.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.name).toBe(validUser.name);
      expect(savedUser.email).toBe(validUser.email);
    });
  });

  describe('Validation errors', () => {
    test('should handle missing fields gracefully', async () => {
      const invalidUser = { name: 'Test User' }; // Missing email and password

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      // The controller will likely throw an error due to mongoose validation
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('should handle invalid email format', async () => {
      const invalidUser = {
        ...validUser,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      // This depends on if email validation is implemented in the model
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Duplicate user errors', () => {
    test('should return error when user already exists', async () => {
      // Register user first time
      await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      // Try to register same user again
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email already in use');
    });

    test('should allow registration with same name but different email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      // Register second user with same name but different email
      const secondUser = {
        ...validUser,
        email: 'john.doe2@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(secondUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.user.email).toBe(secondUser.email);
    });
  });

  describe('Password security', () => {
    test('should use bcrypt for password hashing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      const savedUser = await User.findById(response.body.user._id);
      
      // Check that password is hashed (should not match original)
      expect(savedUser.password).not.toBe(validUser.password);
      
      // Check that bcrypt can verify the password
      const isMatch = await bcrypt.compare(validUser.password, savedUser.password);
      expect(isMatch).toBe(true);
    });

    test('should not return password in response', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('__v');
    });
  });

  describe('Database operations', () => {
    test('should save user to database', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      const savedUser = await User.findById(response.body.user._id);
      expect(savedUser).toBeTruthy();
      expect(savedUser.name).toBe(validUser.name);
      expect(savedUser.email).toBe(validUser.email);
    });

    test('should create user with timestamps', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      const savedUser = await User.findById(response.body.user._id);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
      expect(savedUser.createdAt).toEqual(savedUser.updatedAt);
    });
  });

  describe('Error handling', () => {
    test('should handle invalid JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    test('should handle server errors gracefully', async () => {
      // Test with invalid data that might cause internal errors
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: null, email: null, password: null });
      
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });
});