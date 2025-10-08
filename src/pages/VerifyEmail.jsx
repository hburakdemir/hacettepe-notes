import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { authAPI } from '../services/api'; 

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await authAPI.verifyEmail(email, code);

      if (response.data) {
        alert('Email doğrulandı! Giriş yapabilirsiniz.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccessMessage('');
    setResendLoading(true);

    try { 
      const response = await authAPI.resendCode(email);
      setSuccessMessage(response.data?.message || 'Yeni kod gönderildi!');
    } catch (err) {
      setError(err.response?.data?.message || 'Kod gönderilemedi');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-primary rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <Mail className="h-16 w-16 text-[#2F5755] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Email Doğrulama</h2>
          <p className="text-gray-600 mt-2">
            {email} adresine gönderilen 6 haneli kodu girin
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <input
              type="text"
              maxLength="6"
              placeholder="Doğrulama Kodu"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755]"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-[#2F5755] text-primary py-3 rounded-lg hover:bg-[#5A9690] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#2F5755] hover:underline text-sm disabled:text-gray-400 disabled:no-underline"
          >
            {resendLoading ? 'Gönderiliyor...' : 'Kodu tekrar gönder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;