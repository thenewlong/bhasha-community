import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModeratorPage from "./pages/moderator/ModeratorPage";
import ContributionPage from "./pages/student/ContributionPage";

// 🎬 Intro Video Component Import
import IntroVideo from "./components/IntroVideo";

export default function App() {
  // Check kar rahe hain ki kya intro dekha gaya hai
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("hasSeenIntro");
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setShowIntro(false); // Ye false hote hi niche wala <Routes> aur AuthPage apne aap dikhne lagega
  };

  return (
    <>
      {showIntro ? (
        <IntroVideo onComplete={handleIntroComplete} />
      ) : (
        <Routes>
          {/* Default Route "/" par AuthPage (Login/Signup) dikhega */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/moderator" element={<ModeratorPage />} />
          <Route path="/contribution" element={<ContributionPage />} />
        </Routes>
      )}
    </>
  );
}