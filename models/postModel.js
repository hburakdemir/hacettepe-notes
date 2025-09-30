import pool from '../db.js';

// Post oluşturma
export async function addPostModel({ user_id, faculty, department, title, content, file_url }) {
  const res = await pool.query(
    `INSERT INTO posts (user_id, faculty, department, title, content, file_url, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [user_id, faculty, department, title, content, file_url]
  );
  return res.rows[0];
}

// Tüm postları kullanıcı bilgisiyle getir
export async function getAllPostsWithUsers() {
  const res = await pool.query(`
    SELECT 
      posts.id AS post_id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.faculty,
      posts.department,
      posts.file_url,
      users.id AS user_id,
      users.full_name,
      users.username,
      users.email
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  return res.rows;
}


export async function getPostByUserId(userId) {
  const res = await pool.query(`
    SELECT
      posts.id AS post_id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.faculty,
      posts.department,
      posts.file_url,
      users.full_name,
      users.username,
      users.email 
    FROM posts 
    JOIN users ON posts.user_id = users.id
    WHERE users.id = $1
    ORDER BY posts.created_at DESC
  `, [userId]);
  
  return res.rows;
}