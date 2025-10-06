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


export async function deleteUserByAdminModel(userId, currentUserRole) {
  try {
    if (currentUserRole !== 'admin') {
      throw new Error('Admin değilsin niye silmeye çalışıyorsun???');
    }

    await pool.query("UPDATE posts SET approved_by = NULL WHERE approved_by = $1", [userId]);
    await pool.query("UPDATE posts SET rejected_by = NULL WHERE rejected_by = $1", [userId]);

    const res = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, full_name, username, email, role",
      [userId]
    );

    return res.rows[0];
  } catch (err) {
    console.error('deleteUserByAdminModel hatası backend', err);
    throw err;
  }
}
