# Auth Service Testing Documentation

This document describes the testing setup for the CartFlow Auth Service using Jest and MongoDB Memory Server.

## Testing Stack

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing Node.js HTTP servers
- **MongoDB Memory Server**: In-memory MongoDB instance for testing
- **Babel**: JavaScript compiler for ES6+ module support in tests

## Test Structure

```
tests/
├── setup.js                      # Test environment setup
├── helpers/
│   └── testHelpers.js            # Test utility functions  
├── auth.test.js                  # Unit tests for auth register endpoint
├── auth.integration.test.js      # Integration tests for auth register
├── login.test.js                 # Unit tests for auth login endpoint
└── login.integration.test.js     # Integration tests for auth login
```

## Configuration Files

### Jest Configuration (`jest.config.js`)
```javascript
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
};
```

### Babel Configuration (`.babelrc`)
```json
{
  "presets": ["@babel/preset-env"]
}
```

## Test Setup

### MongoDB Memory Server Setup (`tests/setup.js`)

The setup file configures an in-memory MongoDB instance for each test run:

- Creates a new MongoDB Memory Server instance before all tests
- Connects Mongoose to the in-memory database
- Cleans up the database before each test to ensure test isolation
- Properly closes connections after all tests complete

### Test Helpers (`tests/helpers/testHelpers.js`)

Utility functions for common test operations:

- `createTestUser(userData)`: Creates a user in the test database
- `clearDatabase()`: Manually clears all test data
- `generateValidUserData(overrides)`: Generates valid test user data

## Running Tests

### Basic Commands
```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

### Test Categories

#### Auth Register Tests (`auth.test.js` & `auth.integration.test.js`)
Tests the `/api/auth/register` endpoint with various scenarios:

**Successful Registration:**
- Valid user registration
- Password hashing verification
- Default role assignment
- Different user roles

**Validation Errors:**
- Missing required fields (name, email, password)
- Multiple validation scenarios

**Duplicate User Handling:**
- Email uniqueness enforcement
- Case-insensitive email checking

**Address Handling:**
- Complete address information
- Registration without address

**Database Operations:**
- Proper data persistence
- Timestamp creation

#### Auth Login Tests (`login.test.js` & `login.integration.test.js`)
Tests the `/api/auth/login` endpoint with comprehensive coverage:

**Successful Login:**
- Valid credential authentication
- Case-insensitive email login
- Multi-role user authentication
- Password verification with bcrypt

**Validation Errors:**
- Missing email or password
- Empty string validation
- Malformed request handling

**Authentication Failures:**
- Non-existent user handling
- Incorrect password scenarios
- Security message consistency

**Security Features:**
- Password exclusion from responses
- Special character password support
- Case-insensitive email matching

**Edge Cases:**
- Different email formats (user+tag@example.com, etc.)
- Concurrent login attempts
- Email with special characters
- Performance benchmarks

**Integration Scenarios:**
- Complete register-then-login workflows
- Multi-user registration and authentication
- Role-based login verification
- Data integrity between register/login

## Test Data Structure

### Register Endpoint Data Structure

**Valid User Registration Object:**
```javascript
{
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
}
```

**Expected Registration Response:**
```javascript
{
  success: true,
  message: 'User registered successfully',
  user: {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    address: { /* address object */ },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
    // Note: password is excluded from response
  }
}
```

### Login Endpoint Data Structure

**Valid Login Credentials:**
```javascript
{
  email: 'john.doe@example.com',
  password: 'password123'
}
```

**Expected Login Response:**
```javascript
{
  success: true,
  message: 'Login successful',
  user: {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    address: { /* address object */ },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
    // Note: password is excluded from response
  }
}
```

**Login Error Response:**
```javascript
{
  success: false,
  message: 'Invalid email or password'
}
```

## Key Features Tested

### Security Features
- Password hashing with bcrypt
- Password exclusion from API responses
- Input validation and sanitization

### Data Validation
- Required field validation
- Email format and uniqueness
- Role enumeration enforcement

### Database Integration
- Proper MongoDB document creation
- Timestamp handling
- Address schema validation

### Error Handling
- Duplicate email prevention
- Missing field validation
- Invalid JSON handling
- Graceful error responses

## Test Isolation

Each test runs in complete isolation:

1. **Database State**: Fresh database for each test
2. **No Side Effects**: Tests don't affect each other
3. **Predictable Results**: Consistent test outcomes

## Performance Considerations

- In-memory database provides fast test execution
- Parallel test execution where safe
- Efficient setup and teardown processes

## Best Practices Demonstrated

1. **Comprehensive Coverage**: Tests cover happy paths, edge cases, and error conditions
2. **Realistic Data**: Uses real-world data scenarios
3. **Security Testing**: Validates security features like password hashing
4. **Performance Awareness**: Includes performance benchmarks
5. **Clean Architecture**: Separates test utilities and maintains clean test structure

## Adding New Tests

When adding new tests:

1. Use the existing test helpers for common operations
2. Follow the established naming conventions
3. Ensure proper test isolation
4. Include both positive and negative test cases
5. Test error conditions and edge cases

## Troubleshooting

### Common Issues

**MongoDB Memory Server startup issues:**
- Ensure sufficient memory available
- Check if MongoDB binaries are properly downloaded
- Verify Node.js version compatibility

**Import/Export issues with ES modules:**
- Ensure Babel configuration is correct
- Check file extensions (.js) are included in imports
- Verify package.json has `"type": "module"`

**Test timeouts:**
- Adjust Jest timeout in configuration
- Check for hanging database connections
- Verify proper async/await usage

This testing setup provides a solid foundation for developing and maintaining the auth service with confidence in code quality and functionality.