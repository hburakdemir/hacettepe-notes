import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import ProfilePage from './pages/ProfilePage';
import AddPostPage from './pages/AddPostPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/department/:faculty/:department" element={<DepartmentDetailPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-post"
          element={
            <ProtectedRoute>
              <AddPostPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;