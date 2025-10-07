import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api'; // ✅ Import ekle
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, Send } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // ✅ YENİ: Email doğrulama durumu
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setEmailNotVerified(false); // Yeni input gelince durumu sıfırla
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailNotVerified(false);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      
      // ✅ Email doğrulama kontrolü
      if (result.error?.includes('email adresinizi doğrulayın')) {
        setEmailNotVerified(true);
        // Email bilgisini backend'den almaya çalış (eğer gönderildiyse)
        if (result.email) {
          setUserEmail(result.email);
        }
      }
    }
    
    setLoading(false);
  };

  // ✅ YENİ: Kodu tekrar gönder ve verify sayfasına yönlendir
  const handleResendAndVerify = async () => {
    if (!userEmail) {
      setError('Email adresi bulunamadı. Lütfen tekrar giriş yapmayı deneyin.');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      await authAPI.resendCode(userEmail);
      
      // Başarılı, verify sayfasına yönlendir
      navigate('/verify-email', { 
        state: { email: userEmail } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#003161] to-[#F0F0F0]">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm shadow-purple-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2F5755] mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm">{error}</span>
                  
                  {/* ✅ YENİ: Email doğrulama butonu */}
                  {emailNotVerified && (
                    <button
                      onClick={handleResendAndVerify}
                      disabled={resendLoading}
                      className="mt-3 w-full flex items-center justify-center space-x-2 bg-[#2F5755] hover:bg-[#5A9690] text-white py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {resendLoading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="kullanıcı adınız"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Şifre
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
                  placeholder="*******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5 text-red-900" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2F5755] hover:bg-[#5A9690] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Giriş yapılıyor...</span>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-[#2F5755] hover:text-[#5A9690] font-medium">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;