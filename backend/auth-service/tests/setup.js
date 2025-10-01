import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
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