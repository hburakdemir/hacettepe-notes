import db from '../db.js';

// Mevcut kullanıcı bilgilerini getir
export async function getUserById(id) {
  const query = 'SELECT id, full_name, username, phone FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
}

// Username'in başka bir kullanıcıda olup olmadığını kontrol et
export async function checkUsernameExists(username, excludeUserId) {
  const query = 'SELECT id, username FROM users WHERE LOWER(username) = LOWER($1) AND id != $2';
  const result = await db.query(query, [username, excludeUserId]);
  

  
  return result.rows.length > 0;
}

// Kullanıcı bilgilerini güncelleyen SQL sorgusu (sadece değişen alanlar) //claude yaptı cachte tutuyor error verirse unutma
export async function updateUserProfile(id, updates) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (updates.full_name !== undefined) {
    fields.push(`full_name = $${paramIndex}`);
    values.push(updates.full_name);
    paramIndex++;
  }

  if (updates.username !== undefined) {
    fields.push(`username = $${paramIndex}`);
    values.push(updates.username);
    paramIndex++;
  }

  if (updates.phone !== undefined) {
    fields.push(`phone = $${paramIndex}`);
    values.push(updates.phone);
    paramIndex++;
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, full_name, username, email, phone;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
}