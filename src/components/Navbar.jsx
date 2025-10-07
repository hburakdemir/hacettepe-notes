import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Library,
  LogOut,
  Menu,
  X,
  PlusCircle,
  LucideBadgeHelp,
  ShieldOff,
} from "lucide-react";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="md:ml-40 sm:ml-0 xs:ml-0 flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="images/logo.png"
                alt="Nottepe Logo"
                className="h-20 w-20 object-contain flex flex-1"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated &&
              (user?.role === "admin" || user?.role === "moderator") && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-black hover:text-[#2F5755] focus:text-[#2F5755] px-3 py-2 rounded-md transition"
                >
                  <ShieldOff className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
            <Link
              to="/"
              className="flex items-center space-x-1 text-black hover:text-[#2F5755] focus:text-[#2F5755]  px-3 py-2 rounded-md transition"
            >
              <Home className="h-5 w-5" />
              <span>Ana Sayfa</span>
            </Link>
            <Link
              to="/departments"
              className="flex items-center space-x-1 text-black hover:text-[#2F5755] focus:text-[#2F5755]  px-3 py-2 rounded-md transition"
            >
              <Library className="h-6 w-6" />
              <span>Bölümler</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/help"
                  className="flex items-center space-x-1 text-black hover:text-[#2F5755] focus:text-[#2F5755]  px-3 py-2 rounded-md transition"
                >
                  <LucideBadgeHelp className="h-5 w-5" />
                  <span>Buraya bi bakar mısın?</span>
                </Link>
                <Link
                  to="/add-post"
                  className="flex items-center space-x-1 text-black hover:text-[#2F5755] focus:text-[#2F5755]  px-3 py-2 rounded-md transition"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Not Ekle</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-black hover:text-[#2F5755] focus:text-[#2F5755]  px-3 py-2 rounded-md transition"
                >
                  <Icon icon="game-icons:deer-head" className="h-8 w-8" />
                  <span>{user?.username || "Profil"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-[#660B05] hover:text-[#e28882] px-3 py-2 rounded-md transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-[#003161] hover:bg-[#006A67] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className=" bg-[#2F5755] hover:bg-[#5A9690] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* mobillll hamburger*/}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:[text-[#2F5755]] hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* hamburger içi */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {isAuthenticated &&
              (user?.role === "admin" || user?.role === "moderator") && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <ShieldOff className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Home className="h-5 w-5" />
              <span>Ana Sayfa</span>
            </Link>
            <Link
              to="/departments"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Library className="h-5 w-5" />
              <span>Bölümler</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/add-post"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Not Ekle</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <Icon icon="game-icons:deer-head" className="h-5 w-5" />
                  <span>{user?.username || "Profil"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[#003161] hover:bg-[#006A67] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[#2F5755] hover:bg-[#5A9690] text-white  font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
