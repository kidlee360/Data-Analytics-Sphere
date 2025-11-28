// server_src/middleware/validation.ts
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to check for errors after running validation chains
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // Proceed to the controller if no errors
    }

    // Return 400 Bad Request with detailed errors if validation fails
    return res.status(400).json({ 
        errors: errors.array({ onlyFirstError: true }) // Only show the first error per field
    });
};

// Validation chain for the user registration endpoint
export const registrationValidation: ValidationChain[] = [
    // Email Validation: Check if it's a valid email format
    body('email')
        .isEmail().withMessage('Email must be a valid format (e.g., user@domain.com)')
        .normalizeEmail(), // Sanitizes the email (e.g., converts to lowercase)

    // Password Validation: Check length and complexity
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must include one uppercase letter, one number, and one symbol.'),
    
    // First Name Validation: Check for presence and length
    body('firstName')
        .trim() // Removes leading/trailing whitespace (sanitization)
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
];

// Validation chain for user login
export const loginValidation: ValidationChain[] = [
    body('email').isEmail().withMessage('Invalid email format.'),
    body('password').notEmpty().withMessage('Password is required.'),
];