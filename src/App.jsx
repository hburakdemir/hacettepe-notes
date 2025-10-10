import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AddPostPage from "./pages/AddPostPage";
import NotFound from "./pages/error/NotFound";
import ServerError from "./pages/error/ServerError";
import Help from "./pages/Help";
import AdminPanel from "./pages/AdminPanel";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { HelmetProvider } from "react-helmet-async";
import { Server } from "lucide-react";


function App() {
  return (
    <HelmetProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path ="/verify-email" element={<VerifyEmail/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/department/:faculty/:department"
          element={<DepartmentDetailPage />}
        />
        <Route
          path="/profile"element={
          <ProtectedRoute>
            <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-post"element={
            <ProtectedRoute>
              <AddPostPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<ServerError />} />
    </Routes>
    </HelmetProvider>
  );
}

export default App;
