import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { 
  Mail, 
  Lock, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  ShieldAlert 
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

  // UI States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          navigate("/contribution");

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
          navigate("/moderator");

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
          navigate("/admin-dashboard"); // Routes to src/pages/admin/AdminDashboard.jsx
        }

      } else {
        // --- 4. STUDENT SIGNUP ---
        if (captchaInput !== captchaCode) {
          setLoading(false);
          return setError("Captcha code does not match!");
        }

        await signup(email, password, fullName);
        navigate("/contribution");
      }
    } catch (err) {
      setError(err.message ? err.message.replace("Firebase:", "").trim() : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F0F4F8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "28px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
        padding: "36px",
        maxWidth: "440px",
        width: "100%",
        border: "1px solid #E2E8F0"
      }}>

        {/* TITLE */}
        <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1E3A8A", textAlign: "center", margin: "0 0 6px 0" }}>
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </h2>
        <p style={{ color: "#64748B", textAlign: "center", fontSize: "14px", margin: "0 0 24px 0", fontWeight: "500" }}>
          {isLogin ? "Select your role and log in to BHASA Portal" : "Join our community and be a part of something bigger."}
        </p>

        {/* ERROR BOX */}
        {error && (
          <div style={{
            backgroundColor: "#FEF2F2",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "13px",
            marginBottom: "20px",
            border: "1px solid #FEE2E2",
            textAlign: "center"
          }}>
            <ShieldAlert size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "text-bottom" }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* USER TYPE */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#1E293B", marginBottom: "6px" }}>User Type</label>
            <div style={{ position: "relative" }}>
              {isLogin ? (
                <select
                  value={role}
                  onChange={(e) => { setRole(e.target.value); setError(""); }}
                  style={{
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    color: "#334155",
                    borderRadius: "14px",
                    padding: "14px 14px 14px 44px",
                    fontSize: "14px",
                    fontWeight: "500",
                    outline: "none",
                    appearance: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="student">Students</option>
                  <option value="moderator">Moderators</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div style={{
                  width: "100%",
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  color: "#1E40AF",
                  borderRadius: "14px",
                  padding: "14px 14px 14px 44px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxSizing: "border-box"
                }}>
                  Students
                </div>
              )}
              <User size={20} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "14px" }} />
              {isLogin && <ChevronDown size={18} color="#94A3B8" style={{ position: "absolute", right: "14px", top: "15px", pointerEvents: "none" }} />}
            </div>
          </div>

          {/* FULL NAME (Signup Only) */}
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#1E293B", marginBottom: "6px" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "14px 14px 14px 44px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <User size={20} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "14px" }} />
              </div>
            </div>
          )}

          {/* EMAIL ADDRESS */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#1E293B", marginBottom: "6px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #E2E8F0",
                  borderRadius: "14px",
                  padding: "14px 14px 14px 44px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <Mail size={20} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "14px" }} />
            </div>
          </div>

          {/* PASSWORD (Only for Signup OR Student Login) */}
          {(!isLogin || (isLogin && role === "student")) && (
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#1E293B", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "14px 44px 14px 44px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Lock size={20} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "14px" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "14px", border: "none", background: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </button>
              </div>
            </div>
          )}

          {/* CAPTCHA (Signup Only) */}
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#1E3A8A", marginBottom: "4px" }}>Captcha Verification</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  fontFamily: "monospace",
                  fontSize: "20px",
                  letterSpacing: "4px",
                  padding: "10px",
                  borderRadius: "12px",
                  flex: 1,
                  textAlign: "center",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}>
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  style={{
                    padding: "10px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    color: "#2563EB"
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
                  style={{
                    width: "100%",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "14px 14px 14px 44px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <ShieldCheck size={20} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "14px" }} />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#1D4ED8",
              color: "#FFFFFF",
              fontWeight: "bold",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(29, 78, 216, 0.3)",
              marginTop: "8px"
            }}
          >
            {loading ? "Processing..." : isLogin ? (role === "student" ? "Log In →" : "Continue →") : "Sign Up →"}
          </button>
        </form>

        {/* BOTTOM NAVIGATION LINK */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", marginTop: "24px", fontWeight: "500" }}>
          {isLogin ? "New Student? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => handleModeSwitch(!isLogin)}
            style={{ border: "none", background: "none", color: "#1D4ED8", fontWeight: "bold", cursor: "pointer" }}
          >
            {isLogin ? "Create Student Account" : "Log In"}
          </button>
        </p>

      </div>
    </div>
  );
}