import React, { useState, useEffect, useRef } from "react";
import {
  X,
  LogOut,
  User,
  Camera
} from "lucide-react";

export default function StudentProfileModal({
  isOpen,
  onClose,
  currentUser,
  logout,
  onNavigateAuth, // AuthPage pe wapas bhejne ke liye prop
  onSaveAvatar
}) {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const fileInputRef = useRef(null);

  // Unique User Key for persistent avatar storage per user
  const userStorageKey = currentUser?.uid || currentUser?.email || currentUser?.id || "guest";

  // 1. AUTOMATIC PROFILE BUILD (Signup / Login se automatic details aayengi)
  useEffect(() => {
    if (currentUser) {
      // Auto Name from Auth Context / Signup Data
      const autoName =
        currentUser.displayName ||
        currentUser.name ||
        (currentUser.email ? currentUser.email.split("@")[0] : "User");

      setName(autoName);

      // Auto Avatar from storage or auth
      const savedAvatar = localStorage.getItem(`user_avatar_${userStorageKey}`);
      setProfileImage(savedAvatar || currentUser.photoURL || currentUser.avatar || null);
    } else {
      setName("USER");
      setProfileImage(null);
    }
  }, [currentUser, isOpen, userStorageKey]);

  // Mobile background scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Auto-generate `@username` from email or name
  const username = currentUser?.email
    ? `@${currentUser.email.split("@")[0].toLowerCase()}`
    : `@${name.toLowerCase().replace(/\s+/g, "")}`;

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
        localStorage.setItem(`user_avatar_${userStorageKey}`, base64Image);
        if (onSaveAvatar) onSaveAvatar(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. LOGOUT & REDIRECT TO AUTHPAGE LOGIC
  const handleLogoutClick = async () => {
    try {
      if (logout) {
        await logout();
      }
      // Session & local auth tokens clear
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout Error:", error);
    }

    if (onClose) onClose();

    // Direct back to AuthPage (Login/Signup screen)
    if (onNavigateAuth) {
      onNavigateAuth("login");
    } else {
      window.location.href = "/auth"; // Fallback URL redirection
    }
  };

  if (!isOpen) return null;

  return (
    <div className="spm-overlay" onClick={onClose}>
      <style>{`
        .spm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 0;
        }

        /* 📱 Mobile Full Screen */
        .spm-card {
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          position: relative;
          box-sizing: border-box;
        }

        /* 💻 Laptop/Desktop View */
        @media (min-width: 640px) {
          .spm-overlay {
            padding: 16px;
          }
          .spm-card {
            max-width: 380px;
            height: auto;
            max-height: 80vh;
            border-radius: 32px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.25);
          }
        }

        .spm-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f3f4f6;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          z-index: 10;
          transition: background-color 0.2s;
        }

        .spm-close-btn:hover {
          background-color: #e5e7eb;
        }

        .spm-dp-container {
          position: relative;
          width: 110px;
          height: 110px;
          margin-bottom: 16px;
        }

        .spm-dp-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid #728464;
          padding: 3px;
          box-sizing: border-box;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .spm-dp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .spm-edit-dp-btn {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background-color: #728464;
          color: #ffffff;
          border: 2px solid #ffffff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .spm-btn-logout {
          width: 100%;
          background-color: #728464;
          color: #ffffff;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }

        .spm-btn-logout:hover {
          background-color: #617154;
        }
        .spm-btn-logout:active {
          transform: scale(0.99);
        }
      `}</style>

      <div className="spm-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Close Button */}
        <button type="button" onClick={onClose} className="spm-close-btn">
          <X size={20} />
        </button>

        {/* Top Profile Content Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "16px" }}>
          
          {/* Profile Picture Upload */}
          <div className="spm-dp-container">
            <div className="spm-dp-circle">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="spm-dp-img" />
              ) : (
                <User size={50} color="#728464" />
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="spm-edit-dp-btn"
              title="Change Profile Picture"
            >
              <Camera size={15} />
            </button>
          </div>

          {/* Automatic Built Name (Clean Text without Pencil Icon) */}
          <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#18181B", textTransform: "uppercase", margin: 0, letterSpacing: "0.5px" }}>
            {name}
          </h2>

          {/* Automatic Built Username */}
          <p style={{ color: "#728464", fontWeight: "600", fontSize: "16px", marginTop: "6px", marginBottom: "0px" }}>
            {username}
          </p>
        </div>

        {/* Logout Action Button Only */}
        <div style={{ marginTop: "32px" }}>
          <button type="button" onClick={handleLogoutClick} className="spm-btn-logout">
            <LogOut size={20} style={{ transform: "rotate(180deg)" }} />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}