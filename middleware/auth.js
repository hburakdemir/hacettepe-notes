import jwt from 'jsonwebtoken';
import { getPostOwnerModel } from '../models/postModel.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Token bulunamadı. Lütfen giriş yapın.');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
     console.log('Token geçersiz veya süresi dolmuş.');
      return res.sendStatus(403);
    }

    req.user = user; 
    next();
  });
}

// YENİ: Rol kontrolü middleware'i
export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        message: 'Yetki bilgisi bulunamadı' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Bu işlem için yetkiniz yok' 
      });
    }

    next();
  };
}

// YENİ: Post sahibi veya moderator/admin kontrolü
export async function checkPostOwnerOrModerator(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Moderator veya admin ise izin ver
    if (userRole === 'moderator' || userRole === 'admin') {
      return next();
    }

    // User ise sadece kendi postunu silebilir
    const post = await getPostOwnerModel(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'Bu postu silme yetkiniz yok' });
    }

    next();
  } catch (error) {
    console.error('Yetki kontrolü hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}