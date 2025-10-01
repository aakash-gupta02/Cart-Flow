import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import bcrypt from 'bcrypt';
import { createTestUser, generateValidUserData } from './helpers/testHelpers.js';

describe('POST /api/auth/login', () => {
  const validUserCredentials = {
    email: 'john.doe@example.com',
    password: 'password123'
  };

  const userData = {
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
    test('should login with valid credentials', async () => {
      // Create user first
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      
      const { user } = response.body;
      expect(user).toHaveProperty('name', userData.name);
      expect(user).toHaveProperty('email', userData.email);
      expect(user).toHaveProperty('role', userData.role);
      expect(user).not.toHaveProperty('password'); // Password should not be in response
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });

    test('should login with case-insensitive email', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'JOHN.DOE@EXAMPLE.COM', // Uppercase email
          password: validUserCredentials.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email.toLowerCase());
    });

    test('should login user with different roles', async () => {
      const sellerUser = await createUserForLogin({
        email: 'seller@example.com',
        role: 'seller'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'seller@example.com',
          password: validUserCredentials.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('seller');
    });

    test('should login admin user', async () => {
      await createUserForLogin({
        email: 'admin@example.com',
        role: 'admin'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: validUserCredentials.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('admin');
    });
  });

  describe('Validation errors', () => {
    test('should return error when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    test('should return error when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    test('should return error when both email and password are missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    test('should return error for empty string email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: '', password: 'password123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });

    test('should return error for empty string password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
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
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    test('should return error for incorrect password', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    test('should return error for correct email but wrong password', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: 'almostcorrect123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should not reveal whether email exists or password is wrong', async () => {
      await createUserForLogin();

      // Test with non-existent email
      const nonExistentResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      // Test with existing email but wrong password
      const wrongPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: 'wrongpassword'
        })
        .expect(401);

      // Both should return the same message for security
      expect(nonExistentResponse.body.message).toBe('Invalid email or password');
      expect(wrongPasswordResponse.body.message).toBe('Invalid email or password');
    });
  });

  describe('Security features', () => {
    test('should never return password in response', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user.__v).toBeUndefined(); // MongoDB version field should also be excluded
    });

    test('should handle password with special characters', async () => {
      const specialPassword = 'P@ssw0rd!@#$%^&*()_+';
      await createUserForLogin({ password: specialPassword });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: specialPassword
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(100) + '123!';
      await createUserForLogin({ password: longPassword });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserCredentials.email,
          password: longPassword
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Edge cases', () => {
    test('should handle email with leading/trailing spaces', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: '  john.doe@example.com  ', // Spaces around email
          password: validUserCredentials.password
        })
        .expect(401); // Should fail since we're not trimming spaces

      expect(response.body.success).toBe(false);
    });

    test('should handle different email formats', async () => {
      const testCases = [
        'user+tag@example.com',
        'user.name@example.co.uk',
        'user123@test-domain.com',
        'a@b.co'
      ];

      for (let i = 0; i < testCases.length; i++) {
        const email = testCases[i];
        const password = `password${i}123`; // Unique password for each user
        
        await createUserForLogin({ email, password });

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email,
            password
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe(email);
      }
    });

    test('should handle concurrent login attempts', async () => {
      await createUserForLogin();

      const promises = Array.from({ length: 5 }, () => {
        return request(app)
          .post('/api/auth/login')
          .send(validUserCredentials);
      });

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Database operations', () => {
    test('should not modify user data during login', async () => {
      const createdUser = await createUserForLogin();
      const originalUpdatedAt = createdUser.updatedAt;

      // Small delay to ensure timestamp would change if modified
      await new Promise(resolve => setTimeout(resolve, 10));

      await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      const userAfterLogin = await User.findById(createdUser._id);
      expect(userAfterLogin.updatedAt.getTime()).toBe(originalUpdatedAt.getTime());
    });

    test('should find user regardless of email case in database', async () => {
      // Create user with lowercase email
      await createUserForLogin({ email: 'test@example.com' });

      // Login with mixed case
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'Test@EXAMPLE.com',
          password: validUserCredentials.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Response structure', () => {
    test('should return consistent response structure on success', async () => {
      await createUserForLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: expect.any(Boolean),
          message: expect.any(String),
          user: expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          })
        })
      );
    });

    test('should return consistent error structure', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      );

      expect(response.body).not.toHaveProperty('user');
    });
  });

  describe('Error handling', () => {
    test('should handle invalid JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(null)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});