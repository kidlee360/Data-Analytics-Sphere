import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes'; // Import the new route
import dataRoutes from './routes/dataRoutes';
import cors from 'cors';
import 'dotenv/config';
import pool from './config/db';

const app = express();
const PORT = process.env.PORT || 8080; //the all caps might be... important

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL, // Use the variable for dynamic origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // CRITICAL: Allows the JWT token header
}));
app.use(express.json()); // Allows parsing of JSON request bodies

// --- Routes integration ---
app.use('/api/auth', authRoutes); // Use the authentication routes
// Integrate Data Routes (These will use the auth middleware)
app.use('/api/data', dataRoutes);


// --- Routes will go here later ---
app.get('/', (req: Request, res: Response) => {
    res.send('AnalyticsSphere API is running!');
});

app.post('/test', (req, res) => res.json({ message: 'Test route works!' }));

// Start Server
console.log("About to start server on port 8080");
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});