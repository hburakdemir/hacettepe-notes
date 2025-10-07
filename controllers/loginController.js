import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../models/loginModel.js';

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı adı ya da şifre yanlış ama hangisi söylemem' });
    }

    // Email doğrulama kontolü
    if (!user.email_verified) {
      return res.status(403).json({ 
        message: "Lütfen önce email adresinizi doğrulayın.",
        email: user.email 
      });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Kullanıcı adı ya da şifre yanlış ama hangisi söylemem' });
    }

    // Token oluştur
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user'
      },
    });

  } catch (error) {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.error('Login hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
}