import pool from './db.js';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');  // PostgreSQL'den zaman alır
    console.log('DB bağlantısı başarılı, zaman:', res.rows[0].now);
    process.exit(0); // başarılıysa çık
  } catch (err) {
    console.error('DB bağlantı hatası:', err.message);
    process.exit(1); // hata varsa çık
  }
}

testConnection();
