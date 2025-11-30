import pool from "../db.js";

// Kullanıcı bir posta oy vermeye çalıştığında sanırım
// - oy yoksa İNSERT
// - oy varsa UPDATE
export async function ratePostModel(user_id, post_id, rating) {
  const existing = await pool.query(
    `SELECT * FROM post_ratings WHERE user_id = $1 AND post_id = $2`,
    [user_id, post_id]
  );

  if (existing.rows.length === 0) {
    const res = await pool.query(
      `INSERT INTO post_ratings (user_id, post_id, rating)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, post_id, rating]
    );
    return res.rows[0];
  } else {
    // UPDATE (kullanıcı oyunu düzenleyebilsin)
    const res = await pool.query(
      `UPDATE post_ratings
       SET rating = $1, updated_at = NOW()
       WHERE user_id = $2 AND post_id = $3
       RETURNING *`,
      [rating, user_id, post_id]
    );
    return res.rows[0];
  }
}

// avrg alıyoz
export async function getPostRatingModel(post_id) {
  const res = await pool.query(
    `SELECT 
       COALESCE(AVG(rating), 0) AS avg_rating,
       COUNT(*) AS rating_count
     FROM post_ratings
     WHERE post_id = $1`,
    [post_id]
  );
  
  return res.rows[0];
}
