import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, User, LogOut, Menu, X, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Hacettepe Notlar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition">
              <Home className="h-5 w-5" />
              <span>Ana Sayfa</span>
            </Link>
            <Link to="/departments" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition">
              <BookOpen className="h-5 w-5" />
              <span>Bölümler</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/add-post" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition">
                  <PlusCircle className="h-5 w-5" />
                  <span>Not Ekle</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition">
                  <User className="h-5 w-5" />
                  <span>{user?.username || 'Profil'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Giriş Yap
                </Link>
                <Link to="/register" className="btn-primary">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
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
              <BookOpen className="h-5 w-5" />
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
                  <User className="h-5 w-5" />
                  <span>{user?.username || 'Profil'}</span>
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
                  className="btn-secondary text-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary text-center"
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