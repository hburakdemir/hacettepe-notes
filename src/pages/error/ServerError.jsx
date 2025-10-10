import React from "react";
import { useNavigate } from "react-router-dom";

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center p-6"
      style={{ backgroundImage: "url('/images/500.jpg')" }}
    >
      <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">500 Internal Server Error</h1>
      <p className="text-white text-lg mb-6 text-center drop-shadow-md">
        Şu an bir hata oluştu ya da bakım yapılıyor. Endişelenme, hemen ilgileniyorum.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Geri Dön
      </button>
    </div>
  );
};

export default ServerError;
