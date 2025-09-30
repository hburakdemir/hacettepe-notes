import pool from '../db.js';

export async function createUser({ full_name, username, email, phone, passwordHash }) {
  const query = `
    INSERT INTO users (full_name, username, email, phone, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, full_name, username, email, phone
  `;
  const values = [full_name, username, email, phone, passwordHash];

  const result = await pool.query(query, values);
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
