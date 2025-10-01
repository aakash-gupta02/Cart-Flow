import request from 'supertest';
import app from '../src/app.js';
import { generateValidUserData } from './helpers/testHelpers.js';

describe('Login Integration Tests', () => {
  
  describe('Register and Login Flow', () => {
    test('should register a user and then login successfully', async () => {
      const userData = generateValidUserData();

      // Step 1: Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);

      // Step 2: Login with the same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.user.email).toBe(userData.email);
      expect(loginResponse.body.user.name).toBe(userData.name);
      expect(loginResponse.body.user._id).toBe(registerResponse.body.user._id);
    });

    test('should register multiple users and login each successfully', async () => {
      const users = [
        generateValidUserData({ email: 'user1@example.com', name: 'User One' }),
        generateValidUserData({ email: 'user2@example.com', name: 'User Two' }),
        generateValidUserData({ email: 'user3@example.com', name: 'User Three' })
      ];

      // Register all users
      for (const user of users) {
        await request(app)
          .post('/api/auth/register')
          .send(user)
          .expect(201);
      }

      // Login each user
      for (const user of users) {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: user.email,
            password: user.password
          })
          .expect(200);

        expect(loginResponse.body.success).toBe(true);
        expect(loginResponse.body.user.email).toBe(user.email);
        expect(loginResponse.body.user.name).toBe(user.name);
      }
    });

    test('should fail login before registration', async () => {
      const userData = generateValidUserData();

      // Try to login before registering
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('Different User Roles Login', () => {
    test('should login users with different roles correctly', async () => {
      const roles = ['user', 'seller', 'admin'];

      for (const role of roles) {
        const userData = generateValidUserData({
          email: `${role}@example.com`,
          role
        });

        // Register user with specific role
        await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        // Login and verify role
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          })
          .expect(200);

        expect(loginResponse.body.user.role).toBe(role);
      }
    });
  });

  describe('Security and Edge Cases', () => {
    test('should handle rapid successive login attempts', async () => {
      const userData = generateValidUserData();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Rapid login attempts
      const promises = Array.from({ length: 10 }, () => {
        return request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          });
      });

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    test('should handle mixed valid and invalid login attempts', async () => {
      const userData = generateValidUserData();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Mix of valid and invalid attempts
      const attempts = [
        { email: userData.email, password: userData.password, shouldSucceed: true },
        { email: userData.email, password: 'wrongpassword', shouldSucceed: false },
        { email: 'wrong@example.com', password: userData.password, shouldSucceed: false },
        { email: userData.email, password: userData.password, shouldSucceed: true },
      ];

      for (const attempt of attempts) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: attempt.email,
            password: attempt.password
          });

        if (attempt.shouldSucceed) {
          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        } else {
          expect(response.status).toBe(401);
          expect(response.body.success).toBe(false);
        }
      }
    });

    test('should handle case variations in email consistently', async () => {
      const userData = generateValidUserData({ email: 'Test@Example.Com' });

      // Register with mixed case email
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try login with different case variations
      const emailVariations = [
        'test@example.com',
        'TEST@EXAMPLE.COM',
        'Test@example.com',
        'test@EXAMPLE.COM'
      ];

      for (const email of emailVariations) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email,
            password: userData.password
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('Data Integrity', () => {
    test('should return complete user data on successful login', async () => {
      const userData = generateValidUserData();

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Login and verify all data is returned
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      const { user } = loginResponse.body;
      
      // Verify all expected fields are present
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('name', userData.name);
      expect(user).toHaveProperty('email', userData.email);
      expect(user).toHaveProperty('role', userData.role);
      expect(user).toHaveProperty('address');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');

      // Verify sensitive fields are not present
      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('__v');

      // Verify address data integrity
      expect(user.address.street).toBe(userData.address.street);
      expect(user.address.city).toBe(userData.address.city);
      expect(user.address.state).toBe(userData.address.state);
    });

    test('should maintain user data consistency between register and login', async () => {
      const userData = generateValidUserData();

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Login user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      // Compare data consistency
      const registerUser = registerResponse.body.user;
      const loginUser = loginResponse.body.user;

      expect(loginUser._id).toBe(registerUser._id);
      expect(loginUser.name).toBe(registerUser.name);
      expect(loginUser.email).toBe(registerUser.email);
      expect(loginUser.role).toBe(registerUser.role);
      expect(loginUser.createdAt).toBe(registerUser.createdAt);
      // updatedAt should be the same since login doesn't modify the user
      expect(loginUser.updatedAt).toBe(registerUser.updatedAt);
    });
  });

  describe('Performance Tests', () => {
    test('should handle login within reasonable time limits', async () => {
      const userData = generateValidUserData();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Measure login performance
      const startTime = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete within 3 seconds
      expect(executionTime).toBeLessThan(3000);
    });

    test('should handle multiple sequential logins efficiently', async () => {
      const userData = generateValidUserData();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const startTime = Date.now();

      // Perform 5 sequential logins
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          })
          .expect(200);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / 5;

      // Average login time should be reasonable
      expect(averageTime).toBeLessThan(1000); // Less than 1 second per login
    });
  });

  describe('Error Recovery', () => {
    test('should allow successful login after failed attempts', async () => {
      const userData = generateValidUserData();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Failed login attempt
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      // Successful login after failure
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});