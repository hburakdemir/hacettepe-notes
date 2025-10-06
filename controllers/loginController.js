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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Kullanıcı adı ya da şifre yanlış ama hangisi söylemem' });
    }

    // ÖNEMLİ: Token'a role eklendi
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        role: user.role || 'user'  // YENİ: Role bilgisi eklendi
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
        role: user.role || 'user'  // YENİ: Role bilgisi eklendi
      },
    });
  } catch (error) {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.error('Login hatası:', error);

    res.status(500).json({ message: 'Sunucu hatası.' });
  }
}