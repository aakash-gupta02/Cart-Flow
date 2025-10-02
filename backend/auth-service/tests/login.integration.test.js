import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('Login Integration Tests', () => {
  const generateValidUserData = (overrides = {}) => {
    return {
      name: 'John Doe',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      ...overrides
    };
  };
  
  describe('Complete Auth Flow', () => {
    test('should register a user and then login successfully', async () => {
      const userData = generateValidUserData();

      // Step 1: Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.message).toBe('User Registered Successfully');

      // Step 2: Login with the same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.message).toBe('Login Successful');
      expect(loginResponse.body.user.email).toBe(userData.email);
      expect(loginResponse.body.user.name).toBe(userData.name);
      expect(loginResponse.body.user._id).toBe(registerResponse.body.user._id);
      expect(loginResponse.body.token).toBeDefined();
      
      // Verify JWT token
      const decoded = jwt.verify(loginResponse.body.token, process.env.JWT_SECRET);
      expect(decoded.userid).toBe(loginResponse.body.user._id);
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
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid Email or Password');
    });
  });

  describe('Token Validation', () => {
    test('should generate valid JWT tokens consistently', async () => {
      const userData = generateValidUserData();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Login multiple times and verify tokens
      for (let i = 0; i < 3; i++) {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          })
          .expect(200);

        expect(loginResponse.body.token).toBeDefined();
        
        // Verify token can be decoded
        const decoded = jwt.verify(loginResponse.body.token, process.env.JWT_SECRET);
        expect(decoded.userid).toBe(loginResponse.body.user._id);
        expect(decoded.exp).toBeDefined();
      }
    });
  });
});