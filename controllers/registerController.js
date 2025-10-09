import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByUsername,
  getUserByEmail,
} from "../models/registerModel.js";
import {
  isValidFullName,
  isValidPhone,
  isValidEmail,
  isValidPassword
} from "../utils/validation.js";
import { sendVerificationEmail } from "../utils/mailService.js";

// 6 haneli rastgele kod oluştur
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function register(req, res) {
  try {
    const { fullName, username, password, passwordConfirm, email, phone } = req.body;

// boşluk engelleme
    const trimmedData = {
      fullName: fullName?.trim(),
      username: username?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
      password: password, // şifreye boşluk eklenebilir
      passwordConfirm: passwordConfirm // şifreye boşluk eklenebilir
    };

    // validasyonlar trimlenmiş datayı kullanıyor
    if (!trimmedData.fullName || !trimmedData.username || !trimmedData.password || !trimmedData.passwordConfirm || !trimmedData.email) {
      return res.status(400).json({ message: "Lütfen zorunlu alanları doldurun." });
    }

    if (!isValidFullName(trimmedData.fullName)) {
      return res.status(400).json({ message: "İsim sadece harflerden oluşmalıdır." });
    }

    const userExists = await getUserByUsername(trimmedData.username);
    if (userExists) {
      return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış." });
    }

    if (!isValidEmail(trimmedData.email)) {
      return res.status(400).json({ message: "Geçerli bir email girin." });
    }

    const emailExists = await getUserByEmail(trimmedData.email);
    if (emailExists) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });
    }

    if (trimmedData.phone && !isValidPhone(trimmedData.phone)) {
      return res.status(400).json({ message: "Abi telefon 11 haneli rakamlardan oluşmalıdır." });
    }

    if (!isValidPassword(trimmedData.password)) {
      return res.status(400).json({ message: "rica etsem 5 karakter 1 büyük harf ve 1 noktalama işareti ile tekrar yapar mısın." });
    }

    if (trimmedData.password !== trimmedData.passwordConfirm) {
      return res.status(400).json({ message: "Şifreler eşleşmiyor." });
    }

    // Şifre hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(trimmedData.password, salt);

    // Doğrulama kodu oluştur
    const verificationCode = generateVerificationCode();

    // Kullanıcı oluştur - trimlenmiş datayı kullan
    const newUser = await createUser({
      full_name: trimmedData.fullName,
      username: trimmedData.username,
      email: trimmedData.email,
      phone: trimmedData.phone || null, // Boş string yerine null
      passwordHash,
      verificationCode
    });

    // Mail gönder
    try {
      await sendVerificationEmail(trimmedData.email, verificationCode);
    } catch (mailError) {
      console.error('Mail gönderme hatası:', mailError);
      return res.status(201).json({
        message: "Kullanıcı oluşturuldu ancak doğrulama maili gönderilemedi. Lütfen daha sonra tekrar deneyin.",
        user: newUser
      });
    }

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu. Lütfen email adresinizi kontrol edin ve doğrulama kodunu girin.",
      email: trimmedData.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
}