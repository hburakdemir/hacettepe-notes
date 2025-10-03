import pool from '../db.js';

// Tüm kullanıcıları getir
export async function getAllUsersModel() {
  try {
    const res = await pool.query(
      `SELECT id, full_name, username, email, phone, role 
       FROM users 
       ORDER BY id DESC`
    );
    return res.rows;
  } catch (err) {
    console.error('❌ getAllUsersModel hatası:', err);
    throw err;
  }
}

// Kullanıcı rolünü güncelle
export async function updateUserRoleModel(userId, newRole) {
  try {
    const res = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 
       RETURNING id, full_name, username, email, role`,
      [newRole, userId]
    );
    return res.rows[0];
  } catch (err) {
    console.error('❌ updateUserRoleModel hatası:', err);
    throw err;
  }
}

// Kullanıcıyı ID ile getir
export async function getUserByIdModel(userId) {
  try {
    const res = await pool.query(
      `SELECT id, full_name, username, email, role FROM users WHERE id = $1`,
      [userId]
    );
    return res.rows[0];
  } catch (err) {
    console.error('❌ getUserByIdModel hatası:', err);
    throw err;
  }
}