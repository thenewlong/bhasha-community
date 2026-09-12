import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  ChevronDown, 
  ArrowLeft, 
  Leaf, 
  Layers, 
  User, 
  Sparkles,
  Flame,
  Activity,
  Target,
  X,
  Mail,
  ShieldCheck,
  LogOut,
  CheckCircle2
} from "lucide-react";

export default function ContributionPage() {
  const { currentUser, logout } = useAuth();

  // Form Fields State
  const [kokborok, setKokborok] = useState("");
  const [english, setEnglish] = useState("");
  const [hindi, setHindi] = useState("");
  const [bangali, setBangali] = useState("");
  const [clustering, setClustering] = useState("Most used");
  const [contributorName, setContributorName] = useState(
    currentUser?.displayName || currentUser?.email?.split("@")[0] || ""
  );

  // UI State Controls
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // -------------------------------------------------------------
  // 📱 MOBILE ANTI-ZOOM & GESTURE LOCK (iOS Safari & Android)
  // -------------------------------------------------------------
  useEffect(() => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalContent = viewportMeta ? viewportMeta.getAttribute("content") : null;

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }

    viewportMeta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
    );

    const preventPinch = (e) => {
      if (e.touches && e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener("touchstart", preventPinch, { passive: false });

    return () => {
      if (viewportMeta && originalContent) viewportMeta.setAttribute("content", originalContent);
      document.removeEventListener("touchstart", preventPinch);
    };
  }, []);

  // Submit Handler Connected to Express Backend & Neon Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg(false);

    const payload = {
      kokborok_word: kokborok,
      english_word: english,
      hindi_word: hindi,
      bangali_word: bangali,
      clustering: clustering,
      contributor_name: contributorName,
      submitted_by_email: currentUser?.email || "anonymous@bhasa.com"
    };

    try {
      const response = await fetch("api/contributions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit word to server.");
      }

      setSuccessMsg(true);
      
      // Reset Form Fields
      setKokborok("");
      setEnglish("");
      setHindi("");
      setBangali("");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
      minHeight: "100vh",
      backgroundColor: "#FFFFFF",
      color: "#182216",
      display: "flex",
      justifyContent: "center",
      padding: "20px 16px 50px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      touchAction: "manipulation",
      overflowX: "hidden"
    }}>
      {/* 🎨 INTERNATIONAL LEVEL KEYFRAMES & RESPONSIVE CSS */}
      <style>{`
        * { touch-action: manipulation; box-sizing: border-box; }

        /* Mobile Zoom Lock - Input Font Size Guard */
        @media screen and (max-width: 768px) {
          input, select { font-size: 16px !important; }
        }

        /* Apple Glass Input Focus */
        .bhasa-input-focus:focus {
          border-color: #819A70 !important;
          box-shadow: 0 0 0 4px rgba(129, 154, 112, 0.18) !important;
        }

        /* International Level Liquid Slide Fill Hover Effect on Button */
        .brand-apple-btn {
          position: relative;
          overflow: hidden;
          z-index: 1;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, background-color 0.2s ease;
        }
        .brand-apple-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transition: left 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }
        .brand-apple-btn:hover::before {
          left: 100%;
        }
        .brand-apple-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(129, 154, 112, 0.4) !important;
        }
        .brand-apple-btn:active {
          transform: scale(0.98);
        }

        /* Staggered Letter-by-Letter Entrance Animation for HAMBAI */
        @keyframes hambaiLetterUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.4) rotate(-12deg);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(-6px) scale(1.18) rotate(3deg);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
            filter: blur(0px);
          }
        }

        @keyframes hambaiGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(129, 154, 112, 0.3)); }
          50% { filter: drop-shadow(0 0 25px rgba(129, 154, 112, 0.65)); }
        }

        .hambai-char {
          display: inline-block;
          animation: hambaiLetterUp 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
        }
      `}</style>

      <div style={{ maxWidth: "500px", width: "100%" }}>
        
        {/* TOP BAR: BACK BUTTON & AUTOMATIC STUDENT PROFILE DP CIRCLE */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          
          {/* Back Button */}
          <button 
            type="button"
            onClick={() => window.history.back()}
            style={{ 
              border: "1px solid #E4EAE1", 
              background: "#F8FAF7", 
              borderRadius: "50%",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#182216",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <ArrowLeft size={20} />
          </button>

          {/* 👤 Automatic Round Circle Profile Avatar DP */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            title="Student Profile"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#819A70",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "15px",
              border: "2px solid #E8EFE5",
              boxShadow: "0 4px 14px rgba(129, 154, 112, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease"
            }}
          >
            {getInitials()}
          </button>
        </div>

        {/* HEADER SECTION (Matching Image Header layout) */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ 
            fontSize: "34px", 
            fontWeight: "800", 
            color: "#182216", 
            margin: "0 0 4px 0",
            letterSpacing: "-0.5px"
          }}>
            Kokborok Word
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", margin: "6px 0" }}>
            <span style={{ width: "36px", height: "1px", backgroundColor: "#D1DDD0" }}></span>
            <span style={{ 
              fontSize: "12px", 
              fontWeight: "700", 
              letterSpacing: "4px", 
              color: "#819A70",
              textTransform: "uppercase"
            }}>
              CONTRIBUTION
            </span>
            <span style={{ width: "36px", height: "1px", backgroundColor: "#D1DDD0" }}></span>
          </div>

          <p style={{ color: "#657563", fontSize: "14px", margin: "4px 0 0 0" }}>
            Preserve our language. Build a stronger tomorrow.
          </p>
        </div>

        {/* ERROR MSG ALERT */}
        {errorMsg && (
          <div style={{ 
            backgroundColor: "#FEF2F2", 
            color: "#991B1B", 
            padding: "12px 16px", 
            borderRadius: "16px", 
            fontSize: "14px",
            marginBottom: "18px", 
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <X size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* 1️⃣ MAIN KOKBOROK WORD & TRANSLATION TREE CARD */}
          <div style={{
            backgroundColor: "#F9FAF8",
            border: "1px solid #E3E9E1",
            borderRadius: "24px",
            padding: "18px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.02)"
          }}>
            
            {/* Kokborok Label with Green Dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#819A70" }}></span>
              <label style={{ fontSize: "14px", fontWeight: "700", color: "#182216" }}>
                KOKBOROK  WORDS
              </label>
            </div>

            {/* Input Kokborok */}
            <div style={{ position: "relative" }}>
              <Leaf size={18} color="#819A70" style={{ position: "absolute", left: "16px", top: "15px" }} />
              <input
                type="text"
                required
                placeholder="Enter Kokborok word..."
                value={kokborok}
                onChange={(e) => setKokborok(e.target.value)}
                className="bhasa-input-focus"
                style={{
                  width: "100%",
                  padding: "13px 16px 13px 44px",
                  borderRadius: "16px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#FFFFFF",
                  color: "#182216",
                  outline: "none",
                  fontSize: "14.5px"
                }}
              />
            </div>

            {/* 🌳 TREE CONNECTOR LINES (Matching Image 2 Layout) */}
            <div style={{ position: "relative", height: "26px", width: "100%" }}>
              {/* Vertical center stem from top box */}
              <div style={{ position: "absolute", left: "50%", top: 0, height: "13px", width: "2px", backgroundColor: "#B2C5A4" }}></div>
              {/* Horizontal bar across 3 branches */}
              <div style={{ position: "absolute", left: "16.66%", right: "16.66%", top: "13px", height: "2px", backgroundColor: "#B2C5A4" }}></div>
              {/* Left drop line */}
              <div style={{ position: "absolute", left: "16.66%", top: "13px", bottom: 0, width: "2px", backgroundColor: "#B2C5A4" }}></div>
              {/* Center drop line */}
              <div style={{ position: "absolute", left: "50%", top: "13px", bottom: 0, width: "2px", backgroundColor: "#B2C5A4" }}></div>
              {/* Right drop line */}
              <div style={{ position: "absolute", right: "16.66%", top: "13px", bottom: 0, width: "2px", backgroundColor: "#B2C5A4" }}></div>
            </div>

            {/* 3 TRANSLATION BOXES (BRANCHES WITH SCRIPT BADGES) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              
              {/* English Box */}
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E8DE",
                borderRadius: "16px",
                padding: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#819A70", marginBottom: "4px" }}>
                  
                </div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#182216", display: "block", marginBottom: "6px" }}>
                  English Word
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter English..."
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  className="bhasa-input-focus"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border: "1px solid #D5DDD2",
                    backgroundColor: "#F8FAF7",
                    color: "#182216",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              {/* Hindi Box */}
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E8DE",
                borderRadius: "16px",
                padding: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#7B61FF", marginBottom: "4px" }}>
                  
                </div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#182216", display: "block", marginBottom: "6px" }}>
                  Hindi Word
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Hindi..."
                  value={hindi}
                  onChange={(e) => setHindi(e.target.value)}
                  className="bhasa-input-focus"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border: "1px solid #D5DDD2",
                    backgroundColor: "#F8FAF7",
                    color: "#182216",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

              {/* Bangali Box */}
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E8DE",
                borderRadius: "16px",
                padding: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#E07A5F", marginBottom: "4px" }}>
                  
                </div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#182216", display: "block", marginBottom: "6px" }}>
                  Bangali Word
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Bangali..."
                  value={bangali}
                  onChange={(e) => setBangali(e.target.value)}
                  className="bhasa-input-focus"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border: "1px solid #D5DDD2",
                    backgroundColor: "#F8FAF7",
                    color: "#182216",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
              </div>

            </div>
          </div>

          {/* 2️⃣ SELECT CLUSTERING CARD WITH QUICK SELECTION PILLS */}
          <div style={{
            backgroundColor: "#F9FAF8",
            border: "1px solid #E3E9E1",
            borderRadius: "24px",
            padding: "18px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Layers size={18} color="#819A70" />
              <label style={{ fontSize: "14px", fontWeight: "700", color: "#182216" }}>
                Clustering
              </label>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#819A70" }}></span>
            </div>

            {/* Dropdown */}
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <select
                value={clustering}
                onChange={(e) => setClustering(e.target.value)}
                className="bhasa-input-focus"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "16px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#FFFFFF",
                  color: "#182216",
                  fontSize: "14px",
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer"
                }}
              >
                <option value="Most used">Most used</option>
                <option value="Average used">Average used</option>
                <option value="Rare used">Rare used</option>
              </select>
              <ChevronDown size={18} color="#657563" style={{ position: "absolute", right: "16px", top: "15px", pointerEvents: "none" }} />
            </div>

            {/* Quick Pill Selection Buttons (Matching UI Image) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              
              <button
                type="button"
                onClick={() => setClustering("Most used")}
                style={{
                  padding: "9px 6px",
                  borderRadius: "14px",
                  border: clustering === "Most used" ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: clustering === "Most used" ? "#819A70" : "#FFFFFF",
                  color: clustering === "Most used" ? "#FFFFFF" : "#556453",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Flame size={14} color={clustering === "Most used" ? "#FFFFFF" : "#819A70"} />
                Most used
              </button>

              <button
                type="button"
                onClick={() => setClustering("Average used")}
                style={{
                  padding: "9px 6px",
                  borderRadius: "14px",
                  border: clustering === "Average used" ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: clustering === "Average used" ? "#819A70" : "#FFFFFF",
                  color: clustering === "Average used" ? "#FFFFFF" : "#556453",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Activity size={14} color={clustering === "Average used" ? "#FFFFFF" : "#819A70"} />
                Average
              </button>

              <button
                type="button"
                onClick={() => setClustering("Rare used")}
                style={{
                  padding: "9px 6px",
                  borderRadius: "14px",
                  border: clustering === "Rare used" ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: clustering === "Rare used" ? "#819A70" : "#FFFFFF",
                  color: clustering === "Rare used" ? "#FFFFFF" : "#556453",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Target size={14} color={clustering === "Rare used" ? "#FFFFFF" : "#819A70"} />
                Rare used
              </button>

            </div>
          </div>

          {/* 3️⃣ CONTRIBUTION NAME CARD */}
          <div style={{
            backgroundColor: "#F9FAF8",
            border: "1px solid #E3E9E1",
            borderRadius: "24px",
            padding: "18px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <User size={18} color="#819A70" />
              <label style={{ fontSize: "14px", fontWeight: "700", color: "#182216" }}>
                Contribution Name
              </label>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#819A70" }}></span>
            </div>

            <div style={{ position: "relative" }}>
              <User size={18} color="#819A70" style={{ position: "absolute", left: "16px", top: "15px" }} />
              <input
                type="text"
                required
                placeholder="Enter contribution name..."
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                className="bhasa-input-focus"
                style={{
                  width: "100%",
                  padding: "13px 16px 13px 44px",
                  borderRadius: "16px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#FFFFFF",
                  color: "#182216",
                  fontSize: "14.5px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* 🚀 SUBMIT BUTTON (WITH APPLE LIQUID SLIDE FILL EFFECT) */}
          <button
            type="submit"
            disabled={loading}
            className="brand-apple-btn"
            style={{
              width: "100%",
              backgroundColor: "#819A70",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "16px",
              padding: "16px",
              borderRadius: "26px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              marginTop: "4px",
              boxShadow: "0 6px 18px rgba(129, 154, 112, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? "Submitting..." : (
              <>
                Submit Your Words →
              </>
            )}
          </button>

        </form>

        {/* 🌟 SUBMIT SUCCESSFUL -> STAGGERED LETTER-BY-LETTER "HAMBAI" ANIMATION AREA */}
        {successMsg && (
          <div style={{
            marginTop: "26px",
            padding: "24px",
            backgroundColor: "#F4F7F2",
            borderRadius: "24px",
            border: "1.5px solid #C4D5BA",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(129, 154, 112, 0.12)",
            animation: "hambaiGlowPulse 3s infinite ease-in-out"
          }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
              <Sparkles size={18} color="#819A70" />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#819A70", letterSpacing: "2px", textTransform: "uppercase" }}>
                CONTRIBUTION ACCEPTED
              </span>
              <Sparkles size={18} color="#819A70" />
            </div>

            {/* HAMBAI - STAGGERED ANIMATION FOR EACH LETTER */}
            <div style={{
              fontSize: "42px",
              fontWeight: "900",
              color: "#819A70",
              letterSpacing: "6px",
              margin: "8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}>
              {"HAMBAI".split("").map((letter, index) => (
                <span
                  key={index}
                  className="hambai-char"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  {letter}
                </span>
              ))}
            </div>

            <p style={{ fontSize: "12px", fontWeight: "700", color: "#5F7350", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>
              ( Thank You in Kokborok )
            </p>

            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              fontSize: "13.5px", 
              color: "#2C3A27",
              backgroundColor: "#FFFFFF",
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid #D2DFCC"
            }}>
              <CheckCircle2 size={16} color="#819A70" />
              <span>Word submitted for Moderator review!</span>
            </div>

          </div>
        )}

        {/* FOOTER DIVIDER LEAF (As per second screenshot) */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "12px", 
          marginTop: "32px" 
        }}>
          <span style={{ width: "40px", height: "1px", backgroundColor: "#E3E9E1" }}></span>
          <Leaf size={16} color="#819A70" />
          <span style={{ width: "40px", height: "1px", backgroundColor: "#E3E9E1" }}></span>
        </div>

      </div>

      {/* 👤 STUDENT AUTOMATIC PROFILE MODAL POPUP */}
      {isProfileOpen && (
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
            border: "1px solid #E1E8DE"
          }}>
            {/* Close Cross */}
            <button
              onClick={() => setIsProfileOpen(false)}
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
                setIsProfileOpen(false);
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
      )}

    </div>
  );
}