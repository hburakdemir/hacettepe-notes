import { getAllUsersModel, updateUserRoleModel } from '../models/userModel.js';

// Tüm kullanıcıları getir
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.json(users);
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

