import React from "react";
import { X, Mail, ShieldCheck, LogOut } from "lucide-react";

export default function StudentProfileModal({ isOpen, onClose, currentUser, logout }) {
  if (!isOpen) return null;

  // Student DP Initials Helper
  const getInitials = () => {
    const name = currentUser?.displayName || currentUser?.email || "Student";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "28px",
        padding: "28px",
        maxWidth: "360px",
        width: "100%",
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        position: "relative",
        border: "1px solid #E1E8DE",
        animation: "modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}>
        <style>{`
          @keyframes modalPop {
            0% { opacity: 0; transform: scale(0.9) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Close Cross Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "18px",
            top: "18px",
            border: "none",
            background: "none",
            color: "#657563",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Avatar & Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#819A70",
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            boxShadow: "0 8px 20px rgba(129, 154, 112, 0.35)",
            border: "3px solid #E8EFE5"
          }}>
            {getInitials()}
          </div>

          <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700", color: "#182216" }}>
            {currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student Contributor"}
          </h3>

          <span style={{ 
            fontSize: "11px", 
            fontWeight: "700", 
            color: "#819A70", 
            backgroundColor: "#F2F6F0",
            padding: "4px 12px",
            borderRadius: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Verified Student
          </span>
        </div>

        {/* Profile Info Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            backgroundColor: "#F8FAF7",
            borderRadius: "14px",
            fontSize: "13px",
            border: "1px solid #E5EBE3",
            color: "#2C3A27"
          }}>
            <Mail size={16} color="#819A70" />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.email || "student@bhasa.com"}
            </span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            backgroundColor: "#F8FAF7",
            borderRadius: "14px",
            fontSize: "13px",
            border: "1px solid #E5EBE3",
            color: "#2C3A27"
          }}>
            <ShieldCheck size={16} color="#819A70" />
            <span>Automatic Profile Synced</span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={async () => {
            if (logout) await logout();
            onClose();
          }}
          style={{
            width: "100%",
            backgroundColor: "#FEF2F2",
            color: "#DC2626",
            fontWeight: "700",
            fontSize: "14px",
            padding: "13px",
            borderRadius: "18px",
            border: "1px solid #FCA5A5",
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