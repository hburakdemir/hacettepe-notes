import bcrypt from "bcryptjs";
import { 
  findUserByEmail, 
  saveResetCode, 
  verifyResetCode, 
  updatePassword 
} from "../models/forgotPasswordModel.js";
import { sendPasswordResetEmail } from "../utils/mailService.js";

// 6 haneli kod oluştur
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Şifre sıfırlama kodu gönder
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email adresi gerekli" });
    }

    // Kullanıcı var mı kontrol et
    const user = await findUserByEmail(email);
    if (!user) {
      // Güvenlik için her zaman başarılı gibi göster
      return res.status(200).json({ 
        message: "Eğer bu email kayıtlıysa, şifre sıfırlama kodu gönderildi." 
      });
    }

    // Reset kodu oluştur
    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // reset kodu geçerlilik süresi

    // Veritabanına kaydet
    await saveResetCode(email, resetCode, expiresAt);

    // Mail gönder
    try {
      await sendPasswordResetEmail(email, resetCode);
    } catch (mailError) {
      console.error("Mail gönderme hatası:", mailError);
      return res.status(500).json({ 
        message: "Mail gönderilemedi. Lütfen tekrar deneyin." 
      });
    }

    res.status(200).json({ 
      message: "Şifre sıfırlama kodu email adresinize gönderildi." 
    });

  } catch (error) {
    console.error("Forgot password hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

// Şifreyi sıfırla
export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Tüm alanları doldurun" });
    }
    const user = await verifyResetCode(email, code);
    if (!user) {
      return res.status(400).json({ 
        message: "Kod hatalı veya süresi dolmuş" 
      });
    }

    // Şifre validasyonu
    if (newPassword.length < 5) {
      return res.status(400).json({ 
        message: "Şifre en az 5 karakter olmalıdır" 
      });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ 
        message: "Şifre en az 1 büyük harf içermelidir" 
      });
    }

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(newPassword)) {
      return res.status(400).json({ 
        message: "Şifre en az 1 noktalama işareti içermelidir" 
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Şifreyi güncelle
    await updatePassword(email, passwordHash);

    res.status(200).json({ 
      message: "Şifreniz başarıyla değiştirildi" 
    });

  } catch (error) {
    console.error("Reset password hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}
