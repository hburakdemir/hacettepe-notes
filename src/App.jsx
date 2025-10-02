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
import Help from "./pages/Help";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/help" element={<Help />} />
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

      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
