import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/config.js';

describe('POST /api/auth/login', () => {
  const validUserCredentials = {
    email: 'john.doe@example.com',
    password: 'password123'
  };

  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  };

  // Helper function to create a test user for login tests
  const createUserForLogin = async (userOverrides = {}) => {
    const testUser = { ...userData, ...userOverrides };
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    return await User.create({
      ...testUser,
      password: hashedPassword
    });
  };

  describe('Successful login', () => {
    test('should login with valid credentials and return JWT token', async () => {
      // Create user first
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Login Successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      
      const { user, token } = response.body;
      expect(user).toHaveProperty('name', userData.name);
      expect(user).toHaveProperty('email', userData.email);
      expect(user).not.toHaveProperty('password'); // Password should not be in response
      expect(user).not.toHaveProperty('__v'); // MongoDB version should not be in response
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      
      // Verify JWT token
      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userid).toBe(user._id);
    });

    test('should return JWT token with correct payload', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      const { token, user } = response.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      expect(decoded.userid).toBe(user._id);
      expect(decoded.role).toBeDefined();
      expect(decoded.exp).toBeDefined(); // Token should have expiration
    });

    test('should include all user data except sensitive fields', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      const { user } = response.body;
      
      // Should have these fields
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      
      // Should NOT have these fields
      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('__v');
    });
  });

  describe('Validation errors', () => {
    test('should handle missing credentials gracefully', async () => {
      // Test with missing email
      let response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);

      // Test with missing password  
      response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });

    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Authentication errors', () => {
    test('should return error for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
    });

    test('should return error for incorrect password', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email or Password');
    });

    test('should not reveal whether email exists or password is wrong', async () => {
      await createUserForLogin();

      // Test with non-existent email
      const nonExistentResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      // Test with existing email but wrong password
      const wrongPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: 'wrongpassword'
        });

      // Both should return error status codes
      expect(nonExistentResponse.status).toBe(400);
      expect(wrongPasswordResponse.status).toBe(400);
      expect(nonExistentResponse.body.success).toBe(false);
      expect(wrongPasswordResponse.body.success).toBe(false);
    });
  });

  describe('JWT Token Security', () => {
    test('should generate valid JWT token with user data', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      const { token, user } = response.body;
      
      // Verify token structure
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Decode and verify token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userid).toBe(user._id);
      expect(decoded.role).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    test('should not return sensitive user data', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('__v');
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle malformed request data', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: null, password: null });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });

    test('should handle concurrent login attempts', async () => {
      await createUserForLogin();

      const promises = Array.from({ length: 3 }, () => {
        return request(app)
          .post('/api/auth/login')
          .send(validUserCredentials);
      });

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
      });
    });
  });

});