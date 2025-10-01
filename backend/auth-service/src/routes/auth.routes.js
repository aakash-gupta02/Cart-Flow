import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { loginValidator, registerValidator } from '../validators/authValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);

export default router;