import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

let mongoServer;

beforeAll(async () => {
  // Set up test environment variables - use same JWT_SECRET as .env for consistency
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'jwt-secret-123';
  }
  process.env.NODE_ENV = 'test';
  
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Clean up database before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Cleanup after all tests
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});