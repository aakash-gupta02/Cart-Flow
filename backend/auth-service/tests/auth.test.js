import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import bcrypt from 'bcrypt';

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    }
  };

  describe('Successful registration', () => {
    test('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      
      const { user } = response.body;
      expect(user).toHaveProperty('name', validUser.name);
      expect(user).toHaveProperty('email', validUser.email);
      expect(user).toHaveProperty('role', validUser.role);
      expect(user).not.toHaveProperty('password'); // Password should not be in response
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      expect(user).toHaveProperty('_id');
    });

    test('should hash the password before saving', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      const savedUser = await User.findOne({ email: validUser.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.password).not.toBe(validUser.password);
      
      // Verify password is properly hashed
      const isPasswordValid = await bcrypt.compare(validUser.password, savedUser.password);
      expect(isPasswordValid).toBe(true);
    });

    test('should default role to "user" when not provided', async () => {
      const userWithoutRole = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithoutRole)
        .expect(201);

      expect(response.body.user.role).toBe('user');
    });

    test('should register user with different roles', async () => {
      const sellerUser = {
        ...validUser,
        email: 'seller@example.com',
        role: 'seller'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(sellerUser)
        .expect(201);

      expect(response.body.user.role).toBe('seller');
    });
  });

  describe('Validation errors', () => {
    test('should return error when name is missing', async () => {
      const invalidUser = { ...validUser };
      delete invalidUser.name;

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Name, email, and password are required');
    });

    test('should return error when email is missing', async () => {
      const invalidUser = { ...validUser };
      delete invalidUser.email;

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Name, email, and password are required');
    });

    test('should return error when password is missing', async () => {
      const invalidUser = { ...validUser };
      delete invalidUser.password;

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Name, email, and password are required');
    });

    test('should return error when all required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Name, email, and password are required');
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
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'User already exists with this email');
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

  describe('Address handling', () => {
    test('should save user with complete address', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      const savedUser = await User.findById(response.body.user._id);
      expect(savedUser.address.street).toBe(validUser.address.street);
      expect(savedUser.address.city).toBe(validUser.address.city);
      expect(savedUser.address.state).toBe(validUser.address.state);
      expect(savedUser.address.zip).toBe(validUser.address.zip);
      expect(savedUser.address.country).toBe(validUser.address.country);
    });

    test('should save user without address', async () => {
      const userWithoutAddress = {
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithoutAddress)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      
      const savedUser = await User.findById(response.body.user._id);
      expect(savedUser.address).toBeUndefined();
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
    });
  });
});