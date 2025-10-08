import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { passwordApi } from "../services/api";

import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email yoksa login'e yönlendir
  React.useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const validatePassword = () => {
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
  if (!email) {
    setError("Email adresi bulunamadı. Lütfen tekrar deneyin.");
    return;
  }

  if (!formData.code || formData.code.length !== 6) {
    setError("6 haneli kodu girin.");
    return;
  }

  if (!validatePassword()) return;

  setLoading(true);
  setError("");

  try {
    await passwordApi.resetPassword(email, formData.code, formData.newPassword);

    // Başarılıysa yönlendir
    navigate("/login", {
      state: {
        message: "Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.",
      },
    });
  } catch (err) {
    setError(
      err.response?.data?.message || "Kod hatalı veya süresi dolmuş. Lütfen tekrar deneyin."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#003161] to-[#F0F0F0] dark:from-[#222831] dark:to-[#6d665b]">
      <div className="max-w-md w-full">
        <div className="bg-primary dark:bg-darkbgbutton rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2F5755] dark:bg-darktext mb-4">
              <Lock className="h-8 w-8 text-primary dark:text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-darktext">Yeni Şifre Belirle</h2>
            <p className="text-gray-600  dark:text-darktext mt-2">
              {email} adresine gönderilen kodu girin
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Doğrulama Kodu */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-800 dark:text-darktext mb-2"
              >
                Doğrulama Kodu <span className="text-red-500">*</span>
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength="6"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            {/* Yeni Şifre */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-800 dark:text-darktext mb-2"
              >
                Yeni Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-red-900" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-secondary" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-darktext mt-1">
                En az 5 karakter, 1 büyük harf ve 1 noktalama işareti
              </p>
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-800 dark:text-darktext mb-2"
              >
                Şifre Tekrar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary" />
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5 text-red-900" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-secondary" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2F5755] hover:bg-[#5A9690] text-primary dark:bg-[#DFD0B8] dark:text-secondary hover:dark:bg-[#331D2C] hover:dark:text-darktext font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Şifre değiştiriliyor..." : "Şifreyi Değiştir"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-[#2F5755] hover:text-[#5A9690] dark:text-darkhover hover:dark:text-darktext font-medium"
            >
              Kodu tekrar gönder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;