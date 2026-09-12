import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, ShieldCheck, Award, X, LogOut } from "lucide-react";

export default function StudentProfileModal({ isOpen, onClose, isDarkMode }) {
  const { currentUser, logout } = useAuth();

  if (!isOpen) return null;

  // Extract automatic name & details from currentUser object
  const studentName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student Contributor";
  const email = currentUser?.email || "student@bhasa.com";
  const initials = studentName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    if (logout) await logout();
    onClose();
    window.location.href = "/";
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(8px)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: isDarkMode ? "#121A16" : "#FFFFFF",
        border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#E1E8E0"}`,
        borderRadius: "28px",
        padding: "30px",
        maxWidth: "360px",
        width: "100%",
        color: isDarkMode ? "#F0F4F1" : "#1B241C",
        position: "relative",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
            border: "none",
            background: "none",
            color: isDarkMode ? "#8E9E93" : "#5C6B5E",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Profile Avatar Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)",
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            border: "3px solid #86EFAC",
            boxShadow: "0 8px 20px rgba(74, 222, 128, 0.3)"
          }}>
            {initials}
          </div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700" }}>{studentName}</h3>
          <span style={{ 
            fontSize: "11px", 
            fontWeight: "700", 
            color: "#4ADE80", 
            backgroundColor: "rgba(74, 222, 128, 0.12)",
            padding: "4px 10px",
            borderRadius: "12px",
            textTransform: "uppercase"
          }}>
            Student Contributor
          </span>
        </div>

        {/* Info Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            backgroundColor: isDarkMode ? "#19241F" : "#F4F7F4",
            borderRadius: "14px",
            fontSize: "13px"
          }}>
            <Mail size={16} color="#4ADE80" />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{email}</span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            backgroundColor: isDarkMode ? "#19241F" : "#F4F7F4",
            borderRadius: "14px",
            fontSize: "13px"
          }}>
            <ShieldCheck size={16} color="#4ADE80" />
            <span>Account Verified & Active</span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontWeight: "600",
            fontSize: "14px",
            padding: "12px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}