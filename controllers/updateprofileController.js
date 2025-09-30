// controllers/updateProfileController.js
import { updateUserProfile } from '../models/updateprofileModel.js';

export async function handleUpdateProfile(req, res) {
  try {
    const userId = req.user.userId; // JWT ile gelen kullanıcı ID
    const { full_name, username, email, phone } = req.body;

    if (!full_name || !username || !email || !phone) {
        console.log('gelen veri', req.body)
      return res.status(400).json({ error: 'Tüm alanlar zorunludur.' });
    }

    const updatedUser = await updateUserProfile(userId, full_name, username, email, phone);

    res.status(200).json({ message: 'Profil güncellendi.', user: updatedUser });
    console.log('güncelleme sonrası', req.userId)
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}
