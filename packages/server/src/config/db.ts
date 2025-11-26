import { Pool } from 'pg';
import 'dotenv/config';

// Use parseInt() to convert the DB_PORT string into a number
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: dbPort,
});

// A quick test function to ensure the connection works
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to Postgres database!');
  release();
});

export default pool;