import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModeratorPage from "./pages/moderator/ModeratorPage";
import ContributionPage from "./pages/student/ContributionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/moderator" element={<ModeratorPage />} />
      <Route path="/contribution" element={<ContributionPage />} />
    </Routes>
  );
}