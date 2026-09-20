import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";

// 📷 Assets se Images aur Video Import
import logoImg from "../../assets/bhasha-logos.jpeg"; 
import introVideo from "../../assets/video/welcome.mp4"; // <-- Apni video file yahan assets folder se import karein

import { 
  Mail, 
  Lock, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  Leaf
} from "lucide-react";

export default function AuthPage() {
  const { login, signup, setRoleSession } = useAuth();
  const navigate = useNavigate();

  // Mode State: true = Login | false = Signup
  const [isLogin, setIsLogin] = useState(true);

  // Form Fields
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Captcha State
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");

  // UI, Video & Animation States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false); // 🎬 Video State

  // Refs for custom typing animation scroll sync
  const nameInputRef = useRef(null);
  const nameOverlayRef = useRef(null);
  const emailInputRef = useRef(null);
  const emailOverlayRef = useRef(null);

  // Sync scroll between hidden input and visible animated overlay
  const handleScroll = (inputRef, overlayRef) => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  // -------------------------------------------------------------
  // 📱 MOBILE ZOOM DISABLE & PREVENT PINCH / DOUBLE TAP LOGIC
  // -------------------------------------------------------------
  useEffect(() => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewportContent = viewportMeta ? viewportMeta.getAttribute("content") : null;

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }
    
    viewportMeta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
    );

    const preventPinchZoom = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchstart", preventPinchZoom, { passive: false });
    document.addEventListener("touchend", preventDoubleTapZoom, false);

    return () => {
      if (viewportMeta && originalViewportContent) {
        viewportMeta.setAttribute("content", originalViewportContent);
      }
      document.removeEventListener("touchstart", preventPinchZoom);
      document.removeEventListener("touchend", preventDoubleTapZoom);
    };
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleModeSwitch = (loginMode) => {
    setError("");
    setIsLogin(loginMode);
    setAnimateKey((prev) => prev + 1);
    if (!loginMode) setRole("student");
  };

  // Firestore Email Checker for Admin / Moderator
  const verifyAuthorizedUser = async (collectionName, userEmail) => {
    try {
      const formattedEmail = userEmail.trim().toLowerCase();
      const docRef = doc(db, collectionName, formattedEmail);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (err) {
      console.error("Firestore Permission Error:", err);
      throw new Error("Permission Denied: Firestore verification failed.");
    }
  };

  // Helper for Apple-style Exit Navigation
  const animateAndNavigate = (targetPath) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(targetPath);
    }, 450);
  };

  // 🎥 Video finish hone par navigation handler
  const handleVideoEnd = () => {
    setShowVideoOverlay(false);
    animateAndNavigate("/contribution");
  };

  // Form Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- 1. STUDENT & FACULTY LOGIN (No Video - Direct Navigation) ---
        if (role === "student" || role === "faculty") {
          if (!password) {
            setLoading(false);
            return setError("Please enter your password.");
          }
          await login(email, password);
          animateAndNavigate("/contribution");

        // --- 2. MODERATOR LOGIN ---
        } else if (role === "moderator") {
          if (!email) {
            setLoading(false);
            return setError("Please enter your email address.");
          }
          const isAllowed = await verifyAuthorizedUser("allowed_moderator", email);
          if (!isAllowed) {
            setLoading(false);
            return setError("Access Denied! Your email is not registered in allowed_moderator.");
          }
          
          setRoleSession(email.trim().toLowerCase(), "moderator");
          animateAndNavigate("/moderator");

        // --- 3. ADMIN LOGIN ---
        } else if (role === "admin") {
          if (!email) {
            setLoading(false);
            return setError("Please enter your email address.");
          }
          const isAllowed = await verifyAuthorizedUser("allowed_admins", email);
          if (!isAllowed) {
            setLoading(false);
            return setError("Access Denied! Your email is not registered in allowed_admins.");
          }

          setRoleSession(email.trim().toLowerCase(), "admin");
          animateAndNavigate("/admin-dashboard");
        }

      } else {
        // --- 4. STUDENT / FACULTY SIGNUP (Video Runs First) ---
        if (captchaInput !== captchaCode) {
          setLoading(false);
          return setError("Captcha code does not match!");
        }

        await signup(email, password, fullName, role);
        setLoading(false);
        setShowVideoOverlay(true); // 🎬 Direct redirect karne ke bajaye video play karein
      }
    } catch (err) {
      setError(err.message ? err.message.replace("Firebase:", "").trim() : "Authentication failed.");
      setLoading(false);
    }
  };

  // 💫 HELPER FUNCTION: Letter-by-letter animation render karne ke liye
  const renderAnimatedText = (text, delayOffset = 0) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="animate-letter"
        style={{ animationDelay: `${delayOffset + index * 0.03}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div 
      className="auth-container"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F4F6F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        overflowX: "hidden",
        touchAction: "manipulation"
      }}
    >
      {/* 🎬 FULLSCREEN VIDEO OVERLAY (Signup hone par chalega) */}
      {showVideoOverlay && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000000",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          <video
            src={introVideo}
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* Skip Button */}
          <button
            onClick={handleVideoEnd}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "10px 20px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease"
            }}
          >
            Skip Intro ✕
          </button>
        </div>
      )}

      {/* Dynamic Embedded Animations & Mobile Full Screen CSS */}
      <style>{`
        /* Custom CSS for Static Heading Letter Animation */
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) translateY(5px); }
          50% { transform: scale(1.1) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-letter {
          display: inline-block;
          animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0; 
        }

        /* 🟢 NEW: Typing Animation for Input Fields */
        @keyframes typePop {
          0% { opacity: 0; transform: scale(0.5) translateY(4px); }
          50% { transform: scale(1.1) translateY(-1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .type-letter {
          display: inline-block;
          animation: typePop 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        * {
          touch-action: manipulation;
        }
        @keyframes appleFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes appleExit {
          from { opacity: 1; transform: scale(1); filter: blur(0px); }
          to { opacity: 0; transform: scale(0.92) translateY(-10px); filter: blur(6px); }
        }
        @keyframes inputStagger {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .apple-card {
          animation: ${isExiting ? "appleExit 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "appleFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"};
        }
        .form-stagger {
          animation: inputStagger 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Default Custom Input Class */
        .custom-input {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-input:focus {
          border-color: #5E7053 !important;
          box-shadow: 0 0 0 4px rgba(94, 112, 83, 0.15) !important;
          background-color: #FFFFFF !important;
        }

        /* 🟢 NEW: Custom Container for Animated Inputs */
        .custom-input-container {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: #FFFFFF;
          border: 1px solid #E1E7DC;
          border-radius: 16px;
          position: relative;
          box-sizing: border-box;
        }
        .custom-input-container:focus-within {
          border-color: #5E7053 !important;
          box-shadow: 0 0 0 4px rgba(94, 112, 83, 0.15) !important;
        }

        /* 🟢 NEW: Prevent Browser Autofill from breaking transparent text */
        .transparent-input:-webkit-autofill,
        .transparent-input:-webkit-autofill:hover, 
        .transparent-input:-webkit-autofill:focus, 
        .transparent-input:-webkit-autofill:active {
          -webkit-text-fill-color: transparent !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* 📱 MOBILE FULL SCREEN OVERRIDES */
        @media screen and (max-width: 768px) {
          .auth-container {
            padding: 0 !important;
            background-color: #FFFFFF !important;
            align-items: flex-start !important;
          }
          .apple-card {
            max-width: 100% !important;
            width: 100% !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            border-radius: 0px !important;
            border: none !important;
            box-shadow: none !important;
            padding: 28px 20px 0px 20px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .custom-input, select, input {
            font-size: 16px !important;
          }
          .bottom-graphic {
            margin-left: -20px !important;
            margin-right: -20px !important;
          }
        }

        /* Apple-style Liquid Slide Fill Button */
        .apple-btn {
          position: relative;
          overflow: hidden;
          z-index: 1;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }
        .apple-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }
        .apple-btn:hover::before {
          left: 100%;
        }
        .apple-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 8px 24px rgba(94, 112, 83, 0.35) !important;
        }
        .apple-btn:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* CARD / CONTAINER */}
      <div 
        className="apple-card"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "32px",
          boxShadow: "0 20px 50px rgba(45, 55, 40, 0.08)",
          padding: "40px 36px 0px 36px",
          maxWidth: "420px",
          width: "100%",
          border: "1px solid #E6ECE1",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* MAIN FORM CONTENT WRAPPER */}
        <div>
          {/* LOGO AREA */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "22px" }}>
            <img 
              src={logoImg} 
              alt="BHAShA Logo" 
              style={{ height: "60px", maxWidth: "260px", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: "none", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "1px", color: "#252E20", fontFamily: "serif" }}>
                BHAShA
              </span>
              <span style={{ fontSize: "10px", fontWeight: "800", borderLeft: "2px solid #5E7053", paddingLeft: "8px", color: "#5E7053", lineHeight: "1.1", textTransform: "uppercase" }}>
                THE<br/>NIELIT
              </span>
            </div>
          </div>

          {/* HEADER TITLE WITH ANIMATED TEXT SWITCH */}
          <div key={`head-${animateKey}`} className="form-stagger">
            <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#232A20", textAlign: "left", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              {isLogin ? (
                <>
                  {renderAnimatedText("Welcome ")}
                  <span style={{ color: "#5E7053" }}>
                    {renderAnimatedText("Back", 0.24)}
                  </span>
                </>
              ) : (
                <>
                  {renderAnimatedText("Create Your ")}
                  <span style={{ color: "#5E7053" }}>
                    {renderAnimatedText("Account", 0.36)}
                  </span>
                </>
              )}
            </h2>
            <p style={{ color: "#6A7764", textAlign: "left", fontSize: "13.5px", margin: "0 0 24px 0", fontWeight: "400", lineHeight: "1.4" }}>
              {isLogin ? "Select your role and log in to BHAShA Portal." : "Join our community and be a part of something bigger."}
            </p>
          </div>

          {/* ERROR BOX */}
          {error && (
            <div style={{
              backgroundColor: "#FDF2F2",
              color: "#E04848",
              padding: "12px 14px",
              borderRadius: "14px",
              fontSize: "13px",
              marginBottom: "20px",
              border: "1px solid #F8D7D7",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* FORM FIELDS */}
          <form onSubmit={handleSubmit} key={`form-${animateKey}`} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* USER TYPE */}
            <div className="form-stagger" style={{ animationDelay: "0.05s" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>User Type</label>
              <div style={{ position: "relative" }}>
                {isLogin ? (
                  <select
                    value={role}
                    onChange={(e) => { setRole(e.target.value); setError(""); }}
                    className="custom-input"
                    style={{
                      width: "100%",
                      backgroundColor: "#F9FAFAF8",
                      border: "1px solid #E1E7DC",
                      color: "#2D3728",
                      borderRadius: "16px",
                      padding: "14px 14px 14px 44px",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                      appearance: "none",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                  >
                    <option value="student">Students</option>
                    <option value="faculty">Faculty</option>
                    <option value="moderator">Moderators</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <select
                    value={role}
                    onChange={(e) => { setRole(e.target.value); setError(""); }}
                    className="custom-input"
                    style={{
                      width: "100%",
                      backgroundColor: "#F9FAFAF8",
                      border: "1px solid #E1E7DC",
                      color: "#2D3728",
                      borderRadius: "16px",
                      padding: "14px 14px 14px 44px",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                      appearance: "none",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                  >
                    <option value="student">Students</option>
                    <option value="faculty">Faculty</option>
                  </select>
                )}
                <User size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px" }} />
                <ChevronDown size={18} color="#94A3B8" style={{ position: "absolute", right: "15px", top: "16px", pointerEvents: "none" }} />
              </div>
            </div>

            {/* FULL NAME (Signup Only) - ✨ Animated Typing */}
            {!isLogin && (
              <div className="form-stagger" style={{ animationDelay: "0.1s" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>Full Name</label>
                <div className="custom-input-container">
                  <User size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px", zIndex: 3 }} />
                  
                  {/* Fake Text Overlay for Animation */}
                  <div 
                    ref={nameOverlayRef}
                    style={{
                      position: "absolute", left: "44px", right: "14px", top: "0", bottom: "0",
                      display: "flex", alignItems: "center", pointerEvents: "none",
                      fontSize: "14px", color: "#2B3428", overflowX: "hidden", zIndex: 1, whiteSpace: "pre"
                    }}
                  >
                    {!fullName && <span style={{ color: "#9CA3AF" }}>Enter your full name</span>}
                    {fullName.split("").map((char, i) => (
                      <span key={i} className="type-letter">{char === " " ? "\u00A0" : char}</span>
                    ))}
                  </div>

                  {/* Real Transparent Input */}
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onScroll={() => handleScroll(nameInputRef, nameOverlayRef)}
                    className="transparent-input"
                    style={{
                      width: "100%", padding: "14px 14px 14px 44px", fontSize: "14px",
                      outline: "none", border: "none", background: "transparent",
                      color: "transparent", caretColor: "#2B3428", position: "relative", zIndex: 2, boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            )}

            {/* EMAIL ADDRESS - ✨ Animated Typing */}
            <div className="form-stagger" style={{ animationDelay: isLogin ? "0.1s" : "0.15s" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>Email Address</label>
              <div className="custom-input-container">
                <Mail size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px", zIndex: 3 }} />
                
                {/* Fake Text Overlay for Animation */}
                <div 
                  ref={emailOverlayRef}
                  style={{
                    position: "absolute", left: "44px", right: "14px", top: "0", bottom: "0",
                    display: "flex", alignItems: "center", pointerEvents: "none",
                    fontSize: "14px", color: "#2B3428", overflowX: "hidden", zIndex: 1, whiteSpace: "pre"
                  }}
                >
                  {!email && <span style={{ color: "#9CA3AF" }}>Enter your email address</span>}
                  {email.split("").map((char, i) => (
                    <span key={i} className="type-letter">{char === " " ? "\u00A0" : char}</span>
                  ))}
                </div>

                {/* Real Transparent Input */}
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onScroll={() => handleScroll(emailInputRef, emailOverlayRef)}
                  className="transparent-input"
                  style={{
                    width: "100%", padding: "14px 14px 14px 44px", fontSize: "14px",
                    outline: "none", border: "none", background: "transparent",
                    color: "transparent", caretColor: "#2B3428", position: "relative", zIndex: 2, boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}
            {(!isLogin || (isLogin && (role === "student" || role === "faculty"))) && (
              <div className="form-stagger" style={{ animationDelay: isLogin ? "0.15s" : "0.2s" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-input"
                    style={{
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E1E7DC",
                      borderRadius: "16px",
                      padding: "14px 44px 14px 44px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#2B3428"
                    }}
                  />
                  <Lock size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px" }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "15px", top: "15px", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={19} color="#788871" /> : <Eye size={19} color="#788871" />}
                  </button>
                </div>
              </div>
            )}

            {/* CAPTCHA (Signup Only) */}
            {!isLogin && (
              <div className="form-stagger" style={{ animationDelay: "0.25s" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>Captcha Verification</label>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <div style={{
                    backgroundColor: "#161D14",
                    color: "#FFFFFF",
                    fontFamily: "Courier, monospace",
                    fontSize: "20px",
                    letterSpacing: "4px",
                    padding: "12px",
                    borderRadius: "14px",
                    flex: 1,
                    textAlign: "center",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
                  }}>
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #E1E7DC",
                      borderRadius: "14px",
                      backgroundColor: "#FFFFFF",
                      cursor: "pointer",
                      color: "#5E7053",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter Captcha Code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="custom-input"
                    style={{
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E1E7DC",
                      borderRadius: "16px",
                      padding: "14px 14px 14px 44px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#2B3428"
                    }}
                  />
                  <ShieldCheck size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px" }} />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="apple-btn form-stagger"
              style={{
                animationDelay: isLogin ? "0.2s" : "0.3s",
                width: "100%",
                backgroundColor: "#5E7053",
                color: "#FFFFFF",
                fontWeight: "600",
                padding: "15px",
                borderRadius: "16px",
                border: "none",
                fontSize: "15px",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 6px 18px rgba(94, 112, 83, 0.25)",
                marginTop: "10px",
                letterSpacing: "0.2px"
              }}
            >
              {loading ? "Processing..." : isLogin ? ((role === "student" || role === "faculty") ? "Log In →" : "Continue →") : "Sign Up →"}
            </button>
          </form>

          {/* BOTTOM MODE SWITCH LINK */}
          <p style={{ textAlign: "center", fontSize: "13.5px", color: "#6A7764", marginTop: "22px", marginBottom: "28px", fontWeight: "400" }}>
            {isLogin ? "New to BHAShA? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => handleModeSwitch(!isLogin)}
              style={{ 
                border: "none", 
                background: "none", 
                color: "#46563D", 
                fontWeight: "700", 
                cursor: "pointer",
                padding: "0 2px",
                textDecoration: "underline",
                textUnderlineOffset: "3px"
              }}
            >
              {isLogin ? "Create Account" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}