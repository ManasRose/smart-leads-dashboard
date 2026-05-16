import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerValidators, loginValidators } from '../validators/auth.validators';

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user
 * @access Public
 */
router.post('/register', registerValidators, validate, register);

/**
 * @route  POST /api/auth/login
 * @desc   Login user and return JWT
 * @access Public
 */
router.post('/login', loginValidators, validate, login);

/**
 * @route  GET /api/auth/me
 * @desc   Get current authenticated user
 * @access Private
 */
router.get('/me', authenticate, getMe);

export default router;
