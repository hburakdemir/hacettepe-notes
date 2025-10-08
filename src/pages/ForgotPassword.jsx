import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { passwordApi } from "../services/api";

import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
  e.preventDefault();
  setError("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Geçerli bir email adresi girin.");
    return;
  }

  setLoading(true);

  try {
    await passwordApi.forgotPassword(email.trim());

    // Kod gönderildiyse reset sayfasına yönlendir
    navigate("/reset-password", {
      state: { email: email.trim() },
    });
  } catch (err) {
    console.error("Şifre sıfırlama hatası:", err);
    setError(
      err.response?.data?.message ||
        "Bir hata oluştu. Lütfen tekrar deneyin."
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
              <Mail className="h-8 w-8 text-primary dark:text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-darktext">Şifremi Unuttum</h2>
            <p className="text-gray-600 dark:text-darktext mt-2">
              Email adresinize şifre sıfırlama kodu göndereceğiz
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 dark:text-darktext mb-2"
              >
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="ornek@gmail.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2F5755] hover:bg-[#5A9690] text-primary dark:bg-[#DFD0B8] dark:text-secondary hover:dark:bg-[#331D2C] hover:dark:text-darktext font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Kod gönderiliyor...</span>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  <span>Kod Gönder</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-[#2F5755] hover:text-[#5A9690] dark:text-darkhover hover:dark:text-darktext font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;