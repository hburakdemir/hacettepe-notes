import pool from '../db.js';

export async function createUser({ full_name, username, email, phone, passwordHash, verificationCode }) {
  const query = `
    INSERT INTO users (full_name, username, email, phone, password, email_verified, verification_code, verification_code_expires)
    VALUES ($1, $2, $3, $4, $5, FALSE, $6, NOW() + INTERVAL '10 minutes')
    RETURNING id, full_name, username, email, phone, email_verified
  `;
  const values = [full_name, username, email, phone, passwordHash, verificationCode];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function verifyEmail(email, code) {
  const query = `
    UPDATE users 
    SET email_verified = TRUE, verification_code = NULL, verification_code_expires = NULL
    WHERE email = $1 AND verification_code = $2 AND verification_code_expires > NOW()
    RETURNING id, username, email, email_verified
  `;
  const result = await pool.query(query, [email, code]);
  return result.rows[0];
}

export async function getUserByUsername(username) {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await pool.query(query, [username]);
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
}
