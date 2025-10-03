import express from 'express';
import { register, login, refreshToken, logout, getProfile } from '../controllers/auth.controller.js';
import { loginValidator, registerValidator } from '../validators/authValidator.js';
import validate from '../middleware/validate.js';
import { rateLimiter } from '../middleware/rateLimit.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), rateLimiter(20), login);
router.get("/refresh", refreshToken )
router.get("/logout", logout )
router.get("/profile/me", protect, getProfile)


export default router;