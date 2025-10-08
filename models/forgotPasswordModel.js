import pool from "../db.js";

// Kullanıcıyı email ile bul
export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

// Şifre sıfırlama kodunu ve süresini kaydet
export async function saveResetCode(email, resetCode, expiresAt) {
  await pool.query(
    `UPDATE users 
     SET reset_code = $1, reset_code_expires = $2 
     WHERE email = $3`,
    [resetCode, expiresAt, email]
  );
}

// Kodun geçerliliğini kontrol et
export async function verifyResetCode(email, code) {
  const result = await pool.query(
    `SELECT * FROM users 
     WHERE email = $1 
     AND reset_code = $2 
     AND reset_code_expires > NOW()`,
    [email, code]
  );
  return result.rows[0];
}

// Yeni şifreyi güncelle ve reset kodlarını sıfırla
export async function updatePassword(email, passwordHash) {
  await pool.query(
    `UPDATE users 
     SET password = $1, reset_code = NULL, reset_code_expires = NULL 
     WHERE email = $2`,
    [passwordHash, email]
  );
}
