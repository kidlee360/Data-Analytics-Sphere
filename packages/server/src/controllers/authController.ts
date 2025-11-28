// server_src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// Define JWT_SECRET and crash if it's missing (before any functions are called)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined. Cannot start server.");
    // In a production app, you might crash the process
    // process.exit(1); 
}

export const register = async (req: Request, res: Response) => {
    console.log("Register handler called");
    try {
        const { email, password, firstName } = req.body;

        // 1. Validate Input
        if (!email || !password || !firstName) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // 2. Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        // 3. Hash Password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Create User
        const newUser = await User.create({ email, passwordHash, firstName });
        
        // 5. Create Token (for immediate login)
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET!, { expiresIn: '1d' });

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: newUser.id, email: newUser.email, firstName: newUser.first_name }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error during registration.' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 2. Compare Password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 3. Create Token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET!, { expiresIn: '1d' });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, firstName: user.first_name }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error during login.' });
    }
};
