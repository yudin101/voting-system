import { Pool } from "pg";
import env from "./env";

const pool = new Pool({
  user: env.db_user,
  password: env.db_password,
  host: env.db_host,
  database: env.db_name,
  port: env.db_port,
});

export const initializeSchema = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS candidate (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        last_name VARCHAR(100) NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS voter (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        last_name VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        candidate_id INTEGER NOT NULL  REFERENCES candidate (id),
        voter_id INTEGER NOT NULL REFERENCES voter (id) 
      );
    `);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default pool;
