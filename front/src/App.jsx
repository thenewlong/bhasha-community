import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModeratorPage from "./pages/moderator/ModeratorPage";
import ContributionPage from "./pages/student/ContributionPage";

export default function App() {
  return (
    <Routes>
      {/* 🔐 Auth Routes ("/" aur "/auth" dono par AuthPage load hoga) */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* 📊 Dashboard & Pages Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/moderator" element={<ModeratorPage />} />
      <Route path="/contribution" element={<ContributionPage />} />

      {/* 🔄 Fallback Route: Agar koi unknown route ho toh '/' par bhej dega */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}