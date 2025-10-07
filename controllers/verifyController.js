import { verifyEmail } from "../models/registerModel.js";
import { sendVerificationEmail } from "../utils/mailService.js";
import pool from "../db.js";


export async function verifyEmailCode(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email ve kod gerekli." });
    }

    const user = await verifyEmail(email, code);

    if (!user) {
      return res.status(400).json({ message: "Geçersiz veya süresi dolmuş kod." });
    }

    res.status(200).json({ 
      message: "Email başarıyla doğrulandı! Artık giriş yapabilirsiniz.",
      user 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
}

// Kodu tekrar göndr
export async function resendVerificationCode(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email gerekli." });
    }

    // Kullanıcıyı bul
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND email_verified = FALSE',
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı veya zaten doğrulanmış." });
    }

    // Yeni kod oluştur
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Kodu güncelle
    await pool.query(
      `UPDATE users 
       SET verification_code = $1, 
           verification_code_expires = NOW() + INTERVAL '10 minutes'
       WHERE email = $2`,
      [newCode, email]
    );

    // Mail gönder
    await sendVerificationEmail(email, newCode);

    res.status(200).json({ message: "Yeni doğrulama kodu email adresinize gönderildi." });

  } catch (error) {
    console.error('Kod tekrar gönderme hatası:', error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
}