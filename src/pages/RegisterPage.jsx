import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {UserPlus,Mail,Lock,User,AlertCircle, Eye,EyeOff,LucidePhone,} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Frontend validasyonları
  const validateForm = () => {
    // Boş alan kontrolü
    if (!formData.fullName.trim() || !formData.username.trim() || 
        !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("Lütfen zorunlu alanları doldurun");
      return false;
    }

    // İsim validasyonu (sadece harfler ve boşluk)
    const nameRegex = /^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/;
    if (!nameRegex.test(formData.fullName)) {
      setError("İsim sadece harflerden oluşmalıdır");
      return false;
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Geçerli bir email adresi girin");
      return false;
    }

    // Telefon validasyonu (opsiyonel ama doldurulduysa)
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, ''); // Sadece rakamları al
      if (phoneDigits.length !== 11) {
        setError("Telefon numarası 11 haneli olmalıdır (örn: 05551234567)");
        return false;
      }
    }

    // Şifre validasyonu
    if (formData.password.length < 5) {
      setError("Şifre en az 5 karakter olmalıdır");
      return false;
    }

    // Büyük harf kontrolü
    if (!/[A-Z]/.test(formData.password)) {
      setError("Şifre en az 1 büyük harf içermelidir");
      return false;
    }

    // Noktalama işareti kontrolü
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Şifre en az 1 noktalama işareti içermelidir (!@#$%^&* vb.)");
      return false;
    }

    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validasyonu
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.confirmPassword,
      phone: formData.phone,
    });

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }

    setLoading(false);
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
                  placeholder="Burak Demir"
                />
              </div>
            </div>

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
                  placeholder="kullaniciadi"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent"
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