import { deleteUserByAdminModel, getAllUsersModel, searchUsersModel, updateUserRoleModel, updateUserVerifyEmailModel} from '../models/userModel.js';

// Tüm kullanıcıları getir
export const getAllUsersController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;  
    const offset = parseInt(req.query.offset) || 0;  
    const q = req.query.q || null;

    const { users, total } = q ?
    await searchUsersModel(q,limit,offset):
    await getAllUsersModel(limit, offset) ;

    res.json({ users, total });
  } catch (err) {
    console.error('Kullanıcılar alınamadı:', err);
    res.status(500).json({ error: 'Kullanıcılar alınamadı' });
  }
};

// Kullanıcı rolünü güncelle
export const updateUserRoleController = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.userId;

    // Rol kontrolü
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Geçersiz rol' });
    }

    const updatedUser = await updateUserRoleModel(userId, role);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({ 
      message: 'Kullanıcı rolü güncellendi', 
      user: updatedUser 
    });
  } catch (err) {
    console.error('Rol güncellenemedi:', err);
    res.status(500).json({ error: 'Rol güncellenemedi' });
  }
};


export const updateUserEmailVerifyController = async (req, res) => {
  try {
    const { emailVerified } = req.body;
    const userId = req.params.userId;

    if (typeof emailVerified !== "boolean") {
      return res.status(400).json({ message: "emailVerified boolean olmalı" });
    }

    const updatedUser = await updateUserVerifyEmailModel(userId, emailVerified);

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({
      message: "Email doğrulama durumu güncellendi",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Email doğrulama hatası:", err);
    res.status(500).json({ error: "Email onaylanamadı (sunucu hatası)" });
  }
};




export const deleteUserByAdminController = async(req,res) => {
  try {
   const {id} = req.params;
   const currentUserRole = req.user.role;

   const deletedUser = await deleteUserByAdminModel(id,currentUserRole);

   if(!deletedUser){
    return res.status(404).json({message: 'silmeye çalıştığın kullanıcı yok'});
   }
   res.json({message:'kullanıcı silindi',user:deletedUser});
  } catch(err) {
    console.error('kullanıcı silinemedi userController hatası',err);
    res.status(500).json({error:'kullanıcı silinemedi sunucu hatası'})
  }
}


