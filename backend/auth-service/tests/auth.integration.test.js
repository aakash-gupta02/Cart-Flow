import request from 'supertest';
import app from '../src/app.js';
import { createTestUser, generateValidUserData } from './helpers/testHelpers.js';

describe('Auth Register - Integration Tests', () => {
  
  describe('Real-world scenarios', () => {
    test('should not register user with existing email even with different case', async () => {
      const userData = generateValidUserData({ email: 'TEST@EXAMPLE.COM' });
      
      // Create user first
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with lowercase email
      const duplicateUser = {
        ...userData,
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already in use');
    });

    test('should handle multiple concurrent registrations', async () => {
      const promises = Array.from({ length: 3 }, (_, i) => {
        const userData = generateValidUserData({ 
          email: `concurrent-${i}@example.com`,
          name: `User ${i}`
        });
        
        return request(app)
          .post('/api/auth/register')
          .send(userData);
      });

      const responses = await Promise.all(promises);
      
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.user.name).toBe(`User ${index}`);
      });
    });

    test('should handle registration with minimal required fields', async () => {
      const minimalUser = {
        name: 'Minimal User',
        email: 'minimal@example.com',
        password: 'pass'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(minimalUser)
        .expect(201);

      expect(response.body.user.name).toBe(minimalUser.name);
      expect(response.body.user.email).toBe(minimalUser.email);
      expect(response.body.user.role).toBe('user');
    });

    test('should handle very long input values', async () => {
      const longString = 'a'.repeat(1000);
      const userData = generateValidUserData({
        name: longString,
        email: 'long@example.com'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.name).toBe(longString);
    });

    test('should handle special characters in name', async () => {
      const userData = generateValidUserData({
        name: 'José María García-López',
        email: 'special@example.com'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.name).toBe(userData.name);
    });
  });

  describe('Performance and load testing', () => {
    test('should handle registration within reasonable time', async () => {
      const userData = generateValidUserData();
      const startTime = Date.now();

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete within 5 seconds
      expect(executionTime).toBeLessThan(5000);
    });
  });
});