import pool from '../db.js';

export async function getUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(query, [username]);
  return result.rows[0];
}
