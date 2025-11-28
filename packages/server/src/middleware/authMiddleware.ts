// server_src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request object to include the user's ID
interface AuthenticatedRequest extends Request {
    userId?: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined. Cannot start server.");
    // In a production app, you might crash the process
    // process.exit(1); 
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token and decode payload
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: number, email: string };
        //the "!" above tells TypeScript we are sure JWT_SECRET is not undefined
        
        // Attach the user's ID to the request object
        req.userId = decoded.userId;

        next(); // Proceed to the next handler/controller
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};