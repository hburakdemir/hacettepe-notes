import pool from '../db.js';


export const savePost = async (userId, postId) => {
  await pool.query(
    'INSERT INTO saved_posts (user_id, post_id) VALUES ($1, $2)',
    [userId, postId]
  );
};

export const unsavePost = async (userId, postId) => {
  await pool.query(
    'DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2',
    [userId, postId]
  );
};

export const getSavedPostsByUser = async (userId) => {
  const result = await pool.query(`
    SELECT  p.*, 
  s.user_id AS saved_by FROM posts p
JOIN saved_posts s ON p.id = s.post_id
WHERE s.user_id = $1;

  `, [userId]);
  return result.rows;
};
