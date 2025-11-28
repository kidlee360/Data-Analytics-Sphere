// server_src/routes/authRoutes.ts
import express from 'express';
import { validate, registrationValidation, loginValidation } from '../middleware/validation';
import { register, login } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registrationValidation, validate, register);
router.post('/login', loginValidation, validate, login);

export default router;