import pool from "../db.js";

// Tüm kullanıcıları getir
export async function getAllUsersModel(limit = 50, offset = 0) {
  try {
    const res = await pool.query(
      `SELECT id, full_name, username, email, phone, role, email_verified
       FROM users 
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countRes = await pool.query("SELECT COUNT(*) FROM users");
    const total = parseInt(countRes.rows[0].count, 10);

    return { users: res.rows, total };
  } catch (err) {
    console.error(" getAllUsersModel hatası:", err);
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
    console.error(" updateUserRoleModel hatası:", err);
    throw err;
  }
}

// Kullanıcı email onayını güncelle
export async function updateUserVerifyEmailModel(userId, emailVerified) {
  try {
    const res = await pool.query(
      `UPDATE users 
       SET email_verified = $1 
       WHERE id = $2 
       RETURNING id, full_name, username, email, email_verified`,
      [emailVerified, userId]
    );
    return res.rows[0];
  } catch (err) {
    console.error(" updateUserVerifyEmailModel hatası:", err);
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
    console.error(" getUserByIdModel hatası:", err);
    throw err;
  }
}

export async function deleteUserByAdminModel(userId, currentUserRole) {
  try {
    if (currentUserRole !== "admin") {
      throw new Error("Admin değilsin niye silmeye çalışıyorsun???");
    }

    await pool.query(
      "UPDATE posts SET approved_by = NULL WHERE approved_by = $1",
      [userId]
    );
    await pool.query(
      "UPDATE posts SET rejected_by = NULL WHERE rejected_by = $1",
      [userId]
    );

    const res = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, full_name, username, email, role",
      [userId]
    );

    return res.rows[0];
  } catch (err) {
    console.error("deleteUserByAdminModel hatası backend", err);
    throw err;
  }
}

export async function searchUsersModel(query = '', limit = 50, offset = 0) {
  try {
    const searchQuery = `%${query.trim().toLowerCase()}%`;

    const res = await pool.query(
      `SELECT id, full_name, username, email, phone, role, email_verified
       FROM users
       WHERE LOWER(COALESCE(full_name,'') || ' ' || COALESCE(username,'') || ' ' || COALESCE(email,'') || ' ' || COALESCE(phone,'')) LIKE $1
       ORDER BY id DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM users
       WHERE LOWER(COALESCE(full_name,'') || ' ' || COALESCE(username,'') || ' ' || COALESCE(email,'') || ' ' || COALESCE(phone,'')) LIKE $1`,
      [searchQuery]
    );

    return { users: res.rows, total: parseInt(countRes.rows[0].count, 10) };
  } catch (err) {
    console.error("Kullanıcı aranırken bir hata oluştu", err);
    throw err;
  }
}


