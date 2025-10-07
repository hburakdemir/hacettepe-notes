import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api"; // ✅ Import ekle
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  LucidePhone,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidTurkishName = (name) => {
    const allowedChars =
      " abcçdefgğhıijklmnoöprsştuüvyzABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
    for (const ch of name) {
      if (!allowedChars.includes(ch)) return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 11);
      setFormData({ ...formData, [name]: onlyDigits });
      setError("");
      return;
    }

    setFormData({
      ...formData,
      [name]: value.trimStart(),
    });
    setError("");
  };

  const validateForm = () => {
    const trimmedData = {
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone.trim(),
    };

    if (
      !trimmedData.fullName ||
      !trimmedData.username ||
      !trimmedData.email ||
      !trimmedData.password ||
      !trimmedData.confirmPassword
    ) {
      setError("Lütfen zorunlu alanları doldurun");
      return false;
    }

    if (!isValidTurkishName(trimmedData.fullName)) {
      setError("İsim sadece Türkçe harf ve boşluk içerebilir");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setError("Geçerli bir email adresi girin");
      return false;
    }

    if (trimmedData.phone) {
      const phoneDigits = trimmedData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 11) {
        setError("Telefon numarası 11 haneli olmalıdır (örn: 05551234567)");
        return false;
      }
    }

    if (trimmedData.password.length < 5) {
      setError("Şifre en az 5 karakter olmalıdır");
      return false;
    }

    if (!/[A-Z]/.test(trimmedData.password)) {
      setError("Şifre en az 1 büyük harf içermelidir");
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmedData.password)) {
      setError("Şifre en az 1 noktalama işareti içermelidir (!@#$%^&* vb.)");
      return false;
    }

    if (trimmedData.password !== trimmedData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
     
      const response = await authAPI.register({
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        phone: formData.phone.trim(),
      });

      if (response.data) {
       
        navigate('/verify-email', { 
          state: { email: formData.email.trim() } 
        });
      }
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#003161] to-[#F0F0F0]">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2F5755] mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Kayıt Ol</h2>
            <p className="text-gray-600 mt-2">Yeni hesap oluşturun</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* İsim Soyisim */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                İsim Soyisim <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="İsim Soyisim"
                />
              </div>
            </div>

            {/* Kullanıcı adı */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Kullanıcı Adı <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Kullanıcı Adınız"
                />
              </div>
            </div>

            {/* E-posta */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                E-posta <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="ornek@gmail.com"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-red-900" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                En az 5 karakter, 1 büyük harf ve 1 noktalama işareti
              </p>
            </div>

            {/* Şifre tekrar */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Şifre Tekrar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5 text-red-900" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Telefon <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LucidePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="05551234567"
                  maxLength="11"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                11 haneli (Örn: 05551234567)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2F5755] hover:bg-[#5A9690] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Kayıt olunuyor...</span>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Kayıt Ol</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{" "}
              <Link
                to="/login"
                className="text-[#2F5755] hover:text-[#5A9690] font-medium"
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;