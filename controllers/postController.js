import { addPostModel,getAllPostsWithUsers, getPostByUserId } from '../models/postModel.js';

export const addPostController = async (req, res) => {
  try {
    const { faculty, department, title, content } = req.body;
    const file = req.file;
    const userId = req.user.userId; // auth middleware'den geliyor

    const file_url = file ? file.filename : null;

    // Veritabanına kaydet
    const newPost = await addPostModel({
      user_id: userId,
      faculty,
      department,
      title,
      content,
      file_url,
    });

    res.status(200).json({
      message: 'Gönderi başarıyla kaydedildi',
      data: newPost,
    });

  } catch (error) {
    console.error('Gönderi eklenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};



export async function getAllPostsController(req, res) {
  try {
    const posts = await getAllPostsWithUsers();
    res.json(posts);
  } catch (err) {
    console.error('Postlar alınamadı:', err);
    res.status(500).json({ error: 'Postlar alınamadı' });
  }
}


export const getMyPostController = async(req,res) => {
  try {
    const userId = req.user.userId;
    const posts = await getPostByUserId(userId);
    res.json(posts);
  }
  catch(err){
    console.error('kişinin kendi postları alınamadı',err);
    res.status(500).json({error: 'kendi postları alınamadı profil'});
  }
}