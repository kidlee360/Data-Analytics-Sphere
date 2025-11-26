// server_src/routes/authRoutes.ts
import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);
router.post('/login', login);

export default router;