import pool from '../db.js';
import bcrypt from 'bcryptjs';
import { createUser, getUserByUsername, getUserByEmail } from '../models/userModel.js';
import { isValidFullName, isValidPhone, isValidEmail } from '../utils/validation.js';

export async function register(req, res) {
  try {
    const { fullName, username, password, passwordConfirm, email, phone } = req.body;

    // Boş alan kontrolü
    if (!fullName || !username || !password || !passwordConfirm || !email) {
      return res.status(400).json({ message: 'Lütfen zorunlu alanları doldurun.' });
    }

    // fullName validasyonu
    if (!isValidFullName(fullName)) {
      return res.status(400).json({ message: 'İsim sadece harflerden oluşmalıdır.' });
    }

    // username unique kontrolü
    const userExists = await getUserByUsername(username);
    if (userExists) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    }

    // email validasyon + unique kontrol
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Geçerli bir email girin.' });
    }
    const emailExists = await getUserByEmail(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı.' });
    }

    // phone validasyon (opsiyonel)
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Telefon 11 haneli rakamlardan oluşmalıdır.' });
    }

    // password ve passwordConfirm eşitliği
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Şifreler eşleşmiyor.' });
    }

    // Şifre hashle
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Kullanıcı oluştur
    const newUser = await createUser({
      full_name: fullName,
      username,
      email,
      phone,
      passwordHash,
    });

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
}
