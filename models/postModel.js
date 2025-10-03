import pool from '../db.js';

// Post oluşturma
export async function addPostModel({ user_id, faculty, department, title, content, file_url }) {
  const res = await pool.query(
    `INSERT INTO posts (user_id, faculty, department, title, content, file_url, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
     RETURNING *`,
    [user_id, faculty, department, title, content, file_url]
  );
  return res.rows[0];
}

// Tüm postları kullanıcı bilgisiyle getir
export async function getAllPostsWithUsersModel() {
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
    WHERE posts.status = 'approved'
    ORDER BY posts.created_at DESC
  `);
  return res.rows;
}

// Onay bekleyen postları getir
export async function getPendingPostsModel(){
  const res = await pool.query(`
    SELECT
      posts.id AS post_id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.faculty,
      posts.department,
      posts.file_url,
      posts.status,
      users.id AS user_id,
      users.full_name,
      users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.status = 'pending'
    ORDER BY posts.created_at ASC
  `);
  return res.rows;
}

export async function getPostByUserIdModel(userId) {
  const res = await pool.query(`
    SELECT
      posts.id AS post_id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.faculty,
      posts.department,
      posts.file_url,
      posts.status,
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

export const deletePostByIdModel = async (postId, userId) => {
  await pool.query(`
    DELETE FROM posts where id = $1 AND user_id = $2`
    , [postId, userId]);
};

// Post onayla - GÜNCELLEME: approved_by parametresi eklendi
export async function approvePostModel(postId, approvedByUserId) {
  const res = await pool.query(
    `UPDATE posts 
     SET status = 'approved', 
         approved_at = NOW(), 
         approved_by = $2 
     WHERE id = $1 
     RETURNING *`,
    [postId, approvedByUserId]
  );
  return res.rows[0];
}

// Post reddet - GÜNCELLEME: rejected_by parametresi eklendi
export async function rejectPostModel(postId, rejectedByUserId) {
  const res = await pool.query(
    `UPDATE posts 
     SET status = 'rejected', 
         rejected_at = NOW(), 
         rejected_by = $2 
     WHERE id = $1 
     RETURNING *`,
    [postId, rejectedByUserId]
  );
  return res.rows[0];
}

// Moderatör/Admin için post silme (user_id kontrolü yok)
export async function deletePostByIdAdminModel(postId) {
  const res = await pool.query(
    `DELETE FROM posts WHERE id = $1 RETURNING *`,
    [postId]
  );
  return res.rows[0];
}

// Post sahibini kontrol et
export async function getPostOwnerModel(postId) {
  const res = await pool.query(
    `SELECT user_id FROM posts WHERE id = $1`,
    [postId]
  );
  return res.rows[0];
}

// YENİ: Onaylanan postları getir (moderator bilgisi ile)
export async function getApprovedPostsModel() {
  const res = await pool.query(`
    SELECT 
      posts.id AS post_id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.approved_at,
      posts.faculty,
      posts.department,
      posts.file_url,
      posts.status,
      users.id AS user_id,
      users.full_name,
      users.username,
      approver.id AS approver_id,
      approver.username AS approver_username,
      approver.full_name AS approver_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN users AS approver ON posts.approved_by = approver.id
    WHERE posts.status = 'approved'
    ORDER BY posts.approved_at DESC
  `);
  return res.rows;
}

// Tüm postları status ile birlikte getir - GÜNCELLEME: onaylayan/reddeden kişi bilgileri eklendi
export async function getAllPostsWithStatusModel() {
  const res = await pool.query(`
    SELECT
      posts.id AS post_id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.faculty,
      posts.department,
      posts.file_url,
      posts.status,
      posts.rejected_at,
      posts.approved_at,
      users.id AS user_id,
      users.full_name,
      users.username,
      users.email,
      approver.username AS approver_username,
      approver.full_name AS approver_name,
      rejecter.username AS rejecter_username,
      rejecter.full_name AS rejecter_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN users AS approver ON posts.approved_by = approver.id
    LEFT JOIN users AS rejecter ON posts.rejected_by = rejecter.id
    ORDER BY posts.created_at DESC
  `);
  return res.rows;
}