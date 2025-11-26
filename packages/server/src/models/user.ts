// server_src/models/user.ts
import pool from '../config/db';

class User {
    static async create({ email, passwordHash, firstName }: { email: string, passwordHash: string, firstName: string }) {
        const query = `
            INSERT INTO users (email, password_hash, first_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, first_name, created_at
        `;
        const values = [email, passwordHash, firstName];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email: string) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0]; // Returns user object or undefined
    }
}

export default User;