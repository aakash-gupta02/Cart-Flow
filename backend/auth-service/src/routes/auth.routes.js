import express from 'express';
import { register, login, refreshToken } from '../controllers/auth.controller.js';
import { loginValidator, registerValidator } from '../validators/authValidator.js';
import validate from '../middleware/validate.js';
import { rateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), rateLimiter(20), login);
router.get("/refresh", refreshToken )

export default router;