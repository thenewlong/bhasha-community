import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentProfileModal from "../../components/StudentProfileModal";

// 🖼️ Website Logo Asset Import (Apne folder structure ke hisab se path update karein)
import logo from "../../assets/bhasha-logo.jpeg"; 

import { 
  ChevronDown, 
  Leaf, 
  Layers, 
  User, 
  Flame,
  Activity,
  Target,
  X,
  Bell,
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
  const [submittedName, setSubmittedName] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // -------------------------------------------------------------
  // 📱 MOBILE ANTI-ZOOM & GESTURE LOCK
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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const currentContributor = contributorName.trim() || "Contributor";

    const payload = {
      kokborok_word: kokborok,
      english_word: english,
      hindi_word: hindi,
      bangali_word: bangali,
      clustering: clustering,
      contributor_name: currentContributor,
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

      // Trigger Notification on Top Right Bell Icon
      setSubmittedName(currentContributor);
      setHasUnread(true);
      setShowNotification(true);
      
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
      padding: "16px 12px 40px 12px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      touchAction: "manipulation",
      overflowX: "hidden",
      position: "relative"
    }}>
      <style>{`
        * { touch-action: manipulation; box-sizing: border-box; }

        @media screen and (max-width: 768px) {
          input, select { font-size: 14px !important; }
        }

        .bhasa-input-focus:focus {
          border-color: #819A70 !important;
          box-shadow: 0 0 0 3px rgba(129, 154, 112, 0.18) !important;
        }

        /* 🌳 MIND MAP TREE STRUCTURE LOCK FOR MOBILE SCREEN */
        .translation-tree-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 6px !important;
        }

        .tree-connector-line {
          display: block !important;
        }

        /* 🚀 TOP NOTIFICATION DROPDOWN ANIMATION */
        @keyframes notificationPop {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Button Hover & Tap animation */
        .brand-apple-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .brand-apple-btn:active {
          transform: scale(0.98);
        }

        .bell-ring-anim {
          animation: bellRing 2s infinite ease-in-out;
        }

        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(14deg); }
          20%, 40% { transform: rotate(-14deg); }
          50% { transform: rotate(0deg); }
        }
      `}</style>

      <div style={{ maxWidth: "500px", width: "100%" }}>
        
        {/* 🔝 TOP NAVIGATION BAR */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "20px",
          width: "100%",
          position: "relative"
        }}>
          
          {/* 🖼️ LEFT SIDE: WEBSITE LOGO */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img 
              src={logo} 
              alt="Bhasa Logo" 
              style={{ 
                height: "38px", 
                width: "auto", 
                maxHeight: "42px", 
                objectFit: "contain" 
              }} 
            />
          </div>

          {/* 🔔 RIGHT SIDE: NOTIFICATION BELL ICON + PROFILE DP */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            
            {/* Notification Bell Button */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => {
                  setShowNotification(!showNotification);
                  setHasUnread(false);
                }}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#F4F7F2",
                  border: "1px solid #D5DDD2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative"
                }}
              >
                <Bell size={20} color="#819A70" className={hasUnread ? "bell-ring-anim" : ""} />
                
                {/* Red Dot Badge */}
                {hasUnread && (
                  <span style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                    border: "2px solid #FFFFFF"
                  }}></span>
                )}
              </button>

              {/* 🔔 TOP NOTIFICATION POPUP CARD */}
              {showNotification && (
                <div style={{
                  position: "absolute",
                  right: "0",
                  top: "50px",
                  width: "280px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  border: "1px solid #E1EAD9",
                  zIndex: 99,
                  animation: "notificationPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#819A70", letterSpacing: "1px" }}>
                      NOTIFICATION
                    </span>
                    <button 
                      onClick={() => setShowNotification(false)}
                      style={{ border: "none", background: "none", cursor: "pointer", color: "#888" }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {submittedName ? (
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#819A70", marginBottom: "2px" }}>
                        HAMBAI, <span style={{ color: "#182216" }}>{submittedName}!</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#556453", margin: "0 0 8px 0" }}>
                        Thank you for contributing to Kokborok language.
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#819A70", fontWeight: "700" }}>
                        <CheckCircle2 size={14} />
                        <span>Word submitted successfully</span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: "12px", color: "#657563", margin: "4px 0" }}>
                      No new notifications. Submit a word to see updates!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 👤 Student Profile Avatar DP */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              title="Student Profile"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "#89ae71",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "14px",
                border: "2px solid #E8EFE5",
                boxShadow: "0 3px 10px rgba(129, 154, 112, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              {getInitials()}
            </button>
          </div>
        </div>

        {/* HEADER TITLE SECTION */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "800", 
            color: "#182216", 
            margin: "0 0 4px 0",
            letterSpacing: "-0.5px"
          }}>
            KOKBOROK WORDS
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "4px 0" }}>
            <span style={{ width: "30px", height: "1px", backgroundColor: "#D1DDD0" }}></span>
            <span style={{ 
              fontSize: "11px", 
              fontWeight: "700", 
              letterSpacing: "3px", 
              color: "#819A70",
              textTransform: "uppercase"
            }}>
              CONTRIBUTION
            </span>
            <span style={{ width: "30px", height: "1px", backgroundColor: "#D1DDD0" }}></span>
          </div>

          <p style={{ color: "#657563", fontSize: "13px", margin: "2px 0 0 0" }}>
            Preserve our language. Build a stronger tomorrow.
          </p>
        </div>

        {/* ERROR MSG ALERT */}
        {errorMsg && (
          <div style={{ 
            backgroundColor: "#FEF2F2", 
            color: "#991B1B", 
            padding: "10px 14px", 
            borderRadius: "14px", 
            fontSize: "13px",
            marginBottom: "16px", 
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <X size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* 1️⃣ MAIN KOKBOROK WORD & MIND MAP TRANSLATION TREE CARD */}
          <div style={{
            backgroundColor: "#F9FAF8",
            border: "1px solid #E3E9E1",
            borderRadius: "20px",
            padding: "14px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.02)"
          }}>
            
            {/* Kokborok Label */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#182216", letterSpacing: "0.5px" }}>
                KOKBOROK WORD
              </label>
            </div>

            {/* Input Kokborok */}
            <div style={{ position: "relative" }}>
              <Leaf size={16} color="#819A70" style={{ position: "absolute", left: "12px", top: "13px" }} />
              <input
                type="text"
                required
                placeholder="Enter Kokborok word..."
                value={kokborok}
                onChange={(e) => setKokborok(e.target.value)}
                className="bhasa-input-focus"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "14px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#FFFFFF",
                  color: "#182216",
                  outline: "none",
                  fontSize: "13.5px"
                }}
              />
            </div>

            {/* 🌳 MIND MAP TREE CONNECTOR LINES */}
            <div className="tree-connector-line" style={{ position: "relative", height: "22px", width: "100%", margin: "2px 0" }}>
              <div style={{ position: "absolute", left: "50%", top: 0, height: "11px", width: "2px", backgroundColor: "#B2C5A4" }}></div>
              <div style={{ position: "absolute", left: "16.66%", right: "16.66%", top: "11px", height: "2px", backgroundColor: "#B2C5A4" }}></div>
              <div style={{ position: "absolute", left: "16.66%", top: "11px", bottom: 0, width: "2px", backgroundColor: "#B2C5A4" }}></div>
              <div style={{ position: "absolute", left: "50%", top: "11px", bottom: 0, width: "2px", backgroundColor: "#B2C5A4" }}></div>
              <div style={{ position: "absolute", right: "16.66%", top: "11px", bottom: 0, width: "2px", backgroundColor: "#B2C5A4" }}></div>
            </div>

            {/* 3 TRANSLATION BOXES (FORCED 3-COLUMN MIND MAP GRID FOR MOBILE SCREEN) */}
            <div className="translation-tree-grid">
              
              {/* English Box */}
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E8DE",
                borderRadius: "12px",
                padding: "8px 6px",
                minWidth: 0
              }}>
                <label style={{ fontSize: "9.5px", fontWeight: "800", color: "#182216", display: "block", marginBottom: "4px", textAlign: "center", whiteSpace: "nowrap" }}>
                  ENGLISH WORD
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
                    padding: "6px 6px",
                    borderRadius: "8px",
                    border: "1px solid #D5DDD2",
                    backgroundColor: "#F8FAF7",
                    color: "#182216",
                    fontSize: "11px",
                    outline: "none",
                    textAlign: "center"
                  }}
                />
              </div>

              {/* Hindi Box */}
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E8DE",
                borderRadius: "12px",
                padding: "8px 6px",
                minWidth: 0
              }}>
                <label style={{ fontSize: "9.5px", fontWeight: "800", color: "#182216", display: "block", marginBottom: "4px", textAlign: "center", whiteSpace: "nowrap" }}>
                  HINDI WORD
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
                    padding: "6px 6px",
                    borderRadius: "8px",
                    border: "1px solid #D5DDD2",
                    backgroundColor: "#F8FAF7",
                    color: "#182216",
                    fontSize: "11px",
                    outline: "none",
                    textAlign: "center"
                  }}
                />
              </div>

              {/* Bangali Box */}
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E8DE",
                borderRadius: "12px",
                padding: "8px 6px",
                minWidth: 0
              }}>
                <label style={{ fontSize: "9.5px", fontWeight: "800", color: "#182216", display: "block", marginBottom: "4px", textAlign: "center", whiteSpace: "nowrap" }}>
                  BANGALI WORD
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
                    padding: "6px 6px",
                    borderRadius: "8px",
                    border: "1px solid #D5DDD2",
                    backgroundColor: "#F8FAF7",
                    color: "#182216",
                    fontSize: "11px",
                    outline: "none",
                    textAlign: "center"
                  }}
                />
              </div>

            </div>
          </div>

          {/* 2️⃣ SELECT CLUSTERING CARD */}
          <div style={{
            backgroundColor: "#F9FAF8",
            border: "1px solid #E3E9E1",
            borderRadius: "20px",
            padding: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Layers size={16} color="#819A70" />
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#182216", letterSpacing: "0.5px" }}>
                CLUSTERING
              </label>
            </div>

            {/* Dropdown */}
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <select
                value={clustering}
                onChange={(e) => setClustering(e.target.value)}
                className="bhasa-input-focus"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#FFFFFF",
                  color: "#182216",
                  fontSize: "13px",
                  outline: "none",
                  appearance: "none"
                }}
              >
                <option value="Most used">Most used</option>
                <option value="Average used">Average used</option>
                <option value="Rare used">Rare used</option>
              </select>
              <ChevronDown size={16} color="#657563" style={{ position: "absolute", right: "14px", top: "13px", pointerEvents: "none" }} />
            </div>

            {/* Quick Pill Selection Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              
              <button
                type="button"
                onClick={() => setClustering("Most used")}
                style={{
                  padding: "8px 4px",
                  borderRadius: "12px",
                  border: clustering === "Most used" ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: clustering === "Most used" ? "#819A70" : "#FFFFFF",
                  color: clustering === "Most used" ? "#FFFFFF" : "#556453",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Flame size={13} color={clustering === "Most used" ? "#FFFFFF" : "#819A70"} />
                Most used
              </button>

              <button
                type="button"
                onClick={() => setClustering("Average used")}
                style={{
                  padding: "8px 4px",
                  borderRadius: "12px",
                  border: clustering === "Average used" ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: clustering === "Average used" ? "#819A70" : "#FFFFFF",
                  color: clustering === "Average used" ? "#FFFFFF" : "#556453",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Activity size={13} color={clustering === "Average used" ? "#FFFFFF" : "#819A70"} />
                Average
              </button>

              <button
                type="button"
                onClick={() => setClustering("Rare used")}
                style={{
                  padding: "8px 4px",
                  borderRadius: "12px",
                  border: clustering === "Rare used" ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: clustering === "Rare used" ? "#819A70" : "#FFFFFF",
                  color: clustering === "Rare used" ? "#FFFFFF" : "#556453",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Target size={13} color={clustering === "Rare used" ? "#FFFFFF" : "#819A70"} />
                Rare used
              </button>

            </div>
          </div>

          {/* 3️⃣ CONTRIBUTOR NAME CARD */}
          <div style={{
            backgroundColor: "#F9FAF8",
            border: "1px solid #E3E9E1",
            borderRadius: "20px",
            padding: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <User size={16} color="#819A70" />
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#182216", letterSpacing: "0.5px" }}>
                CONTRIBUTOR NAME
              </label>
            </div>

            <div style={{ position: "relative" }}>
              <User size={16} color="#819A70" style={{ position: "absolute", left: "12px", top: "13px" }} />
              <input
                type="text"
                required
                placeholder="Enter contribution name..."
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                className="bhasa-input-focus"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "14px",
                  border: "1px solid #D5DDD2",
                  backgroundColor: "#FFFFFF",
                  color: "#182216",
                  fontSize: "13.5px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* 🚀 SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="brand-apple-btn"
            style={{
              width: "100%",
              backgroundColor: "#819A70",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "15px",
              padding: "14px",
              borderRadius: "22px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              marginTop: "4px",
              boxShadow: "0 4px 14px rgba(129, 154, 112, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            {loading ? "Submitting..." : "Submit Your Words →"}
          </button>

        </form>

        {/* 🌿 FOOTER DIVIDER LEAF */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "10px", 
          marginTop: "24px" 
        }}>
          <span style={{ width: "36px", height: "1px", backgroundColor: "#E3E9E1" }}></span>
          <Leaf size={14} color="#819A70" />
          <span style={{ width: "36px", height: "1px", backgroundColor: "#E3E9E1" }}></span>
        </div>

      </div>

      {/* 👤 STUDENT PROFILE MODAL */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        logout={logout}
      />

    </div>
  );
}