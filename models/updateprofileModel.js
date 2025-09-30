
import db from '../db.js';

// Kullanıcı bilgilerini güncelleyen SQL sorgusu
export async function updateUserProfile(id, full_name, username, email, phone) {
  const query = `
    UPDATE users
    SET full_name = $1,
        username = $2,
        email = $3,
        phone = $4
    WHERE id = $5
    RETURNING *;
  `;

  const values = [full_name, username, email, phone, id];
  console.log('Update sorgusu için parametreler:', values);
  const result = await db.query(query, values);
//   console.log('result:',result)
  return result.rows[0];
}
