import {
  savePost,
  unsavePost,
  getSavedPostsByUser,
} from '../models/savedpostModel.js';

export const getSavedPosts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await getSavedPostsByUser(userId);
    res.json(posts);
  } catch (err) {
    console.error('getSavedPosts error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

export const savePostController = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
    await savePost(userId, postId);
    res.json({ saved: true });
  } catch (err) {
    console.error('savePost error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

export const unsavePostController = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
    await unsavePost(userId, postId);
    res.json({ saved: false });
  } catch (err) {
    console.error('unsavePost error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};


