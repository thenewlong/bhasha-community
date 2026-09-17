import React, { useState, useEffect } from "react";
import { X, User, Mail, Award, BookOpen, LogOut, Check, Edit3 } from "lucide-react";

export default function StudentProfileModal({ isOpen, onClose, currentUser, logout }) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 🔄 AUTO-FILL LOGIC: Email se `@` ke pehle ka part name me set hoga
  useEffect(() => {
    if (currentUser) {
      const email = currentUser?.email || "";
      const emailPrefix = email.includes("@") ? email.split("@")[0] : email;

      // Priority: Display Name -> Email Prefix -> Fallback 'Student'
      const autoFilledName = currentUser?.displayName || emailPrefix || "Student";

      setStudentName(autoFilledName);
      setStudentEmail(email);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Initials generator for DP Avatar (e.g. "rahul_dev" -> "RA")
  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "16px"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "420px",
        padding: "24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        border: "1px solid #E1EAD9",
        position: "relative",
        animation: "modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}>
        <style>{`
          @keyframes modalPop {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* ✖️ CLOSE BUTTON */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            border: "none",
            background: "#F4F7F2",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#657563"
          }}
        >
          <X size={18} />
        </button>

        {/* 👤 AVATAR & HEADER */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#819A70",
            color: "#FFFFFF",
            fontSize: "24px",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            boxShadow: "0 6px 16px rgba(129, 154, 112, 0.3)",
            border: "3px solid #E8EFE5"
          }}>
            {getInitials(studentName)}
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#182216", margin: "0 0 2px 0" }}>
            Student Profile
          </h2>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#819A70", letterSpacing: "1px", textTransform: "uppercase" }}>
            Bhasha Community Member
          </span>
        </div>

        {/* ✅ SUCCESS TOAST */}
        {savedSuccess && (
          <div style={{
            backgroundColor: "#ECFDF5",
            color: "#065F46",
            padding: "8px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "1px solid #A7F3D0"
          }}>
            <Check size={16} /> Profile name updated successfully!
          </div>
        )}

        {/* 📝 PROFILE FORM */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* AUTO-FILLED NAME FIELD */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#182216", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>
              PROFILE NAME
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} color="#819A70" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                disabled={!isEditing}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "12px",
                  border: isEditing ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: isEditing ? "#FFFFFF" : "#F8FAF7",
                  color: "#182216",
                  fontSize: "13px",
                  fontWeight: "600",
                  outline: "none"
                }}
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#819A70"
                  }}
                  title="Edit Name"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* REGISTERED EMAIL FIELD (READ-ONLY) */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#182216", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>
              REGISTERED EMAIL
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#819A70" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="email"
                value={studentEmail}
                readOnly
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "12px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#EEF3EC",
                  color: "#657563",
                  fontSize: "13px",
                  fontWeight: "500",
                  outline: "none",
                  cursor: "not-allowed"
                }}
              />
            </div>
          </div>

          {/* STATUS CARDS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginTop: "4px"
          }}>
            <div style={{
              backgroundColor: "#F4F7F2",
              borderRadius: "14px",
              padding: "10px",
              textAlign: "center",
              border: "1px solid #E1EAD9"
            }}>
              <BookOpen size={16} color="#819A70" style={{ marginBottom: "2px" }} />
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#182216" }}>Active</div>
              <div style={{ fontSize: "10px", color: "#657563", fontWeight: "600" }}>Account Status</div>
            </div>

            <div style={{
              backgroundColor: "#F4F7F2",
              borderRadius: "14px",
              padding: "10px",
              textAlign: "center",
              border: "1px solid #E1EAD9"
            }}>
              <Award size={16} color="#819A70" style={{ marginBottom: "2px" }} />
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#182216" }}>Contributor</div>
              <div style={{ fontSize: "10px", color: "#657563", fontWeight: "600" }}>User Role</div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            {isEditing ? (
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: "#819A70",
                  color: "#FFFFFF",
                  padding: "12px",
                  borderRadius: "14px",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(129, 154, 112, 0.2)"
                }}
              >
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  backgroundColor: "#F4F7F2",
                  color: "#182216",
                  padding: "12px",
                  borderRadius: "14px",
                  border: "1px solid #D5DDD2",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            )}

            {logout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                title="Logout"
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#FEF2F2",
                  color: "#EF4444",
                  borderRadius: "14px",
                  border: "1px solid #FCA5A5",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}