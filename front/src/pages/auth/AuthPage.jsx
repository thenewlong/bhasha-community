import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";

// 📷 File Explorer se logo import (Apne folder path ke hisab se path change kar lein)
import logoImg from "../../assets/bhasha-logo.jpeg"; 

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

  // UI & Animation States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);

  // -------------------------------------------------------------
  // 📱 MOBILE ZOOM DISABLE & PREVENT PINCH / DOUBLE TAP LOGIC
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Dynamic Meta Viewport Injection
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewportContent = viewportMeta ? viewportMeta.getAttribute("content") : null;

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }
    
    // Zoom block parameters set karna
    viewportMeta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
    );

    // 2. iOS Touch Multi-finger Pinch Zoom Block
    const preventPinchZoom = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 3. Prevent Double-Tap Zoom in Safari/Webkit
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

    // Cleanup Jab User Dusre Page Par Jaye
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
    setAnimateKey((prev) => prev + 1); // Trigger form animation on mode switch
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
    }, 450); // Delay for smooth Apple scale-out animation
  };

  // Form Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- 1. STUDENT LOGIN (Email + Password) ---
        if (role === "student") {
          if (!password) {
            setLoading(false);
            return setError("Please enter your password.");
          }
          await login(email, password);
          animateAndNavigate("/contribution");

        // --- 2. MODERATOR LOGIN (Email Only -> Firestore Check) ---
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

        // --- 3. ADMIN LOGIN (Email Only -> Firestore Check -> AdminDashboard) ---
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
        // --- 4. STUDENT SIGNUP ---
        if (captchaInput !== captchaCode) {
          setLoading(false);
          return setError("Captcha code does not match!");
        }

        await signup(email, password, fullName);
        animateAndNavigate("/contribution");
      }
    } catch (err) {
      setError(err.message ? err.message.replace("Firebase:", "").trim() : "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F4F6F2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      overflow: "hidden",
      touchAction: "manipulation" // Prevents zoom gestures globally on this view
    }}>
      {/* Dynamic Embedded Animations & Mobile Anti-Zoom Styles */}
      <style>{`
        * {
          touch-action: manipulation; /* Prevents double-tap zoom on all elements */
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
        /* Custom Input Focus Glow */
        .custom-input {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-input:focus {
          border-color: #5E7053 !important;
          box-shadow: 0 0 0 4px rgba(94, 112, 83, 0.15) !important;
          background-color: #FFFFFF !important;
        }

        /* 📱 Mobile Specific Rules to Stop Input Focus Zooming in iOS Safari */
        @media screen and (max-width: 768px) {
          .custom-input, select, input {
            font-size: 16px !important; /* Font size >= 16px prevents iOS Safari auto zoom on focus */
          }
          .apple-card {
            padding: 30px 24px 0px 24px !important;
            border-radius: 28px !important;
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

      {/* CARD CONTAINER */}
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
          overflow: "hidden"
        }}
      >
        {/* LOGO AREA */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "22px" }}>
          <img 
            src={logoImg} 
            alt="BHAShA Logo" 
            style={{ height: "60px", maxWidth: "260px", objectFit: "contain" }}
            onError={(e) => {
              // Fallback UI agar image load hone me error aaye
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
              <>Welcome <span style={{ color: "#5E7053" }}>Back</span></>
            ) : (
              <>Create Your <span style={{ color: "#5E7053" }}>Account</span></>
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
            <ShieldAlert size={18} style={{ shrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* FORM FIELDS WITH STAGGER ANIMATION */}
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
                  <option value="moderator">Moderators</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div style={{
                  width: "100%",
                  backgroundColor: "#F5F7F3",
                  border: "1px solid #E1E7DC",
                  color: "#2D3728",
                  borderRadius: "16px",
                  padding: "14px 14px 14px 44px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxSizing: "border-box"
                }}>
                  Students
                </div>
              )}
              <User size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px" }} />
              {isLogin && <ChevronDown size={18} color="#94A3B8" style={{ position: "absolute", right: "15px", top: "16px", pointerEvents: "none" }} />}
            </div>
          </div>

          {/* FULL NAME (Signup Only) */}
          {!isLogin && (
            <div className="form-stagger" style={{ animationDelay: "0.1s" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                <User size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px" }} />
              </div>
            </div>
          )}

          {/* EMAIL ADDRESS */}
          <div className="form-stagger" style={{ animationDelay: isLogin ? "0.1s" : "0.15s" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2B3428", marginBottom: "6px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <Mail size={19} color="#788871" style={{ position: "absolute", left: "15px", top: "15px" }} />
            </div>
          </div>

          {/* PASSWORD (Only for Signup OR Student Login) */}
          {(!isLogin || (isLogin && role === "student")) && (
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

          {/* SUBMIT BUTTON WITH SLIDE FILL EFFECT */}
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
            {loading ? "Processing..." : isLogin ? (role === "student" ? "Log In →" : "Continue →") : "Sign Up →"}
          </button>
        </form>

        {/* BOTTOM MODE SWITCH LINK */}
        <p style={{ textAlign: "center", fontSize: "13.5px", color: "#6A7764", marginTop: "22px", marginBottom: "36px", fontWeight: "400" }}>
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

        {/* BOTTOM LEAF MOTIF & MOUNTAIN VECTOR */}
        <div style={{ 
          margin: "0 -36px", 
          padding: "24px 20px 20px 20px", 
          backgroundColor: "#EDF2EA", 
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Leaf Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
            <Leaf size={22} color="#5E7053" />
          </div>
          
          {/* Slogan */}
          <p style={{ 
            fontSize: "13px", 
            fontWeight: "600", 
            color: "#43523C", 
            margin: 0, 
            lineHeight: "1.4",
            letterSpacing: "0.2px",
            fontStyle: "italic"
          }}>
            Preserving Words<br />Building Communities
          </p>

          {/* SVG Mountain Landscape Graphic */}
          <svg 
            viewBox="0 0 500 120" 
            preserveAspectRatio="none" 
            style={{ 
              width: "100%", 
              height: "55px", 
              display: "block", 
              marginTop: "12px",
              marginBottom: "-20px"
            }}
          >
            <path 
              d="M0,60 Q120,20 250,50 T500,30 L500,120 L0,120 Z" 
              fill="#5E7053" 
              opacity="0.3" 
            />
            <path 
              d="M0,80 Q180,40 320,70 T500,50 L500,120 L0,120 Z" 
              fill="#3E4C36" 
              opacity="0.6" 
            />
          </svg>
        </div>

      </div>
    </div>
  );
}