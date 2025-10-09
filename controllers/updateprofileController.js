import { updateUserProfile, getUserById, checkUsernameExists } from '../models/updateprofileModel.js';

export async function handleUpdateProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { full_name, username, phone } = req.body;

    console.log(' Profil güncelleme isteği:', {
      userId,
      gelen_data: { full_name, username, phone }
    });

    // Mevcut kullanıcı bilgilerini al
    const currentUser = await getUserById(userId);
    
    if (!currentUser) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    // console.log('kullanıcı:', currentUser);

    const updates = {};
    let hasChanges = false;

    // full_name kontrolü
    if (full_name !== undefined && full_name.trim() !== '') {
      if (full_name.trim() === currentUser.full_name) {
        return res.status(400).json({ error: 'İsim Soyisim aynı olamaz' });
      }
      updates.full_name = full_name.trim();
      hasChanges = true;
    }

    // username kontrolü
    if (username !== undefined && username.trim() !== '') {
      const trimmedUsername = username.trim();

      if (trimmedUsername.toLowerCase() === currentUser.username.toLowerCase()) {
        return res.status(400).json({ error: 'Kullanıcı adınız eskisiyle aynı olamaz' });
      }

      // Username başka bir kullanıcıda var mı kontrol et
      const usernameExists = await checkUsernameExists(trimmedUsername, userId);
      
      // console.log('kullanıcı adı kontrol', usernameExists);

      if (usernameExists) {
        return res.status(400).json({ error: 'Bu kullanıcı adı daha önce alınmış' });
      }

      updates.username = trimmedUsername;
      hasChanges = true;
    }

    // phone kontrolü
    if (phone !== undefined && phone.trim() !== '') {
      if (phone.trim() === currentUser.phone) {
        return res.status(400).json({ error: 'Telefon numaranız aynı olamaz' });
      }
      updates.phone = phone.trim();
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(400).json({ error: 'Güncellenecek bir değişiklik bulunamadı.' });
    }

    console.log('güncellenecek alanlar', updates);

    // Profili güncelle
    const updatedUser = await updateUserProfile(userId, updates);

    res.status(200).json({ 
      message: 'Profil başarıyla güncellendi.', 
      user: {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone
      }
    });

  } catch (error) {
    console.error(' profil güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}