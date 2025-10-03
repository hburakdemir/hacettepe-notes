import { 
  addPostModel,
  getAllPostsWithUsersModel, 
  getPostByUserIdModel,
  deletePostByIdModel,
  getPendingPostsModel,
  approvePostModel,
  rejectPostModel,
  deletePostByIdAdminModel,
  getAllPostsWithStatusModel,
  getApprovedPostsModel  // EKLENDİ: Bu import eksikti
} from '../models/postModel.js';

export const addPostController = async (req, res) => {
  try {
    const { faculty, department, title, content } = req.body;
    const file = req.file;
    const userId = req.user.userId;

    const file_url = file ? file.filename : null;

    const newPost = await addPostModel({
      user_id: userId,
      faculty,
      department,
      title,
      content,
      file_url,
    });

    res.status(200).json({
      message: 'Gönderi başarıyla kaydedildi ve onay bekliyor',
      data: newPost,
    });

  } catch (error) {
    console.error('Gönderi eklenirken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export async function getAllPostsController(req, res) {
  try {
    const posts = await getAllPostsWithUsersModel();
    res.json(posts);
  } catch (err) {
    console.error('Postlar alınamadı:', err);
    res.status(500).json({ error: 'Postlar alınamadı' });
  }
}

export const getMyPostController = async(req,res) => {
  try {
    const userId = req.user.userId;
    const posts = await getPostByUserIdModel(userId);
    res.json(posts);
  }
  catch(err){
    console.error('kişinin kendi postları alınamadı',err);
    res.status(500).json({error: 'kendi postları alınamadı profil'});
  }
}

export const deletePostController = async (req,res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;
  try {
    await deletePostByIdModel(postId,userId);
    res.json({message:'post başarıyla silindi'});
  } catch (err) {
    console.error('post silinemedi',err);
    res.status(500).json({error:'post silinemiyor'});
  }
};

// Onay bekleyen postları getir
export const getPendingPostsController = async (req, res) => {
  try {
    const posts = await getPendingPostsModel();
    res.json(posts);
  } catch (err) {
    console.error('Bekleyen postlar alınamadı:', err);
    res.status(500).json({ error: 'Bekleyen postlar alınamadı' });
  }
};

// Post onayla
export const approvePostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const approvedByUserId = req.user.userId;
    
    const post = await approvePostModel(postId, approvedByUserId);
   
    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }
   
    res.json({ message: 'Post onaylandı', post });
  } catch (err) {
    console.error('Post onaylanamadı:', err);
    res.status(500).json({ error: 'Post onaylanamadı' });
  }
};

// Post reddet
export const rejectPostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const rejectedByUserId = req.user.userId;
    
    const post = await rejectPostModel(postId, rejectedByUserId);
   
    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }
   
    res.json({ message: 'Post reddedildi', post });
  } catch (err) {
    console.error('Post reddedilemedi:', err);
    res.status(500).json({ error: 'Post reddedilemedi' });
  }
};

// Onaylanan postları getir
export const getApprovedPostsController = async (req, res) => {
  try {
    const posts = await getApprovedPostsModel();
    res.json(posts);
  } catch (err) {
    console.error('Onaylı postlar alınamadı:', err);
    res.status(500).json({ error: 'Onaylı postlar alınamadı' });
  }
};

// Moderatör/Admin post silme
export const deletePostAdminController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await deletePostByIdAdminModel(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }
    
    res.json({ message: 'Post başarıyla silindi', post });
  } catch (err) {
    console.error('Post silinemedi:', err);
    res.status(500).json({ error: 'Post silinemedi' });
  }
};

// Tüm postları status ile getir
export const getAllPostsWithStatus = async (req, res) => {
  try {
    const posts = await getAllPostsWithStatusModel();
    res.json(posts);
  } catch (err) {
    console.error('Postlar alınamadı:', err);
    res.status(500).json({ error: 'Postlar alınamadı' });
  }
}