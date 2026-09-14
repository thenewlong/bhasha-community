import React from "react";
import { X, LogOut, BookOpen, Flame, Activity, Target, ShieldCheck, Sparkles } from "lucide-react";

export default function StudentProfileModalUI({
  isOpen,
  onClose,
  currentUser,
  userWords,
  loading,
  activeTab,
  setActiveTab,
  stats,
  handleLogout,
}) {
  if (!isOpen) return null;

  const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Contributor";
  const userEmail = currentUser?.email || "No Email Provided";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 26, 17, 0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "88vh",
          backgroundColor: "#FFFFFF",
          borderRadius: "28px",
          border: "1px solid #E1EAD9",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* 🔝 MODAL HEADER */}
        <div
          style={{
            padding: "20px 20px 16px 20px",
            backgroundColor: "#F7F9F6",
            borderBottom: "1px solid #E8EFE5",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: "16px",
              top: "16px",
              background: "#EAF0E7",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#556453",
            }}
          >
            <X size={18} />
          </button>

          {/* User Info Avatar Banner */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#819A70",
                color: "#FFFFFF",
                fontSize: "22px",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(129, 154, 112, 0.35)",
              }}
            >
              {userInitial}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#182216", margin: 0 }}>
                  {displayName}
                </h3>
                <ShieldCheck size={16} color="#819A70" />
              </div>
              <p style={{ fontSize: "12px", color: "#657563", margin: "2px 0 0 0" }}>{userEmail}</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "10px",
                borderRadius: "14px",
                border: "1px solid #E1EAD9",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#819A70" }}>
                {stats.total}
              </div>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#657563" }}>TOTAL WORDS</div>
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "10px",
                borderRadius: "14px",
                border: "1px solid #E1EAD9",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#E11D48" }}>
                {stats.mostUsed}
              </div>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#657563" }}>MOST USED</div>
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "10px",
                borderRadius: "14px",
                border: "1px solid #E1EAD9",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#D97706" }}>
                {stats.rareUsed}
              </div>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#657563" }}>RARE WORDS</div>
            </div>
          </div>
        </div>

        {/* 📑 TAB NAVIGATION */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E8EFE5",
            backgroundColor: "#FFFFFF",
          }}
        >
          <button
            onClick={() => setActiveTab("words")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              background: "none",
              fontWeight: "700",
              fontSize: "12.5px",
              color: activeTab === "words" ? "#819A70" : "#889685",
              borderBottom: activeTab === "words" ? "2px solid #819A70" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            My Contributions ({stats.total})
          </button>
        </div>

        {/* 📜 SCROLLABLE BODY LIST */}
        <div
          style={{
            padding: "16px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backgroundColor: "#FAFBF9",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#819A70", fontSize: "13px" }}>
              Fetching submitted words...
            </div>
          ) : userWords.length === "0" || userWords.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "#889685" }}>
              <Sparkles size={32} color="#819A70" style={{ marginBottom: "8px" }} />
              <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#182216" }}>
                No Contributions Yet
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>
                Aapne abhi tak koi word submit nahi kiya hai. Form fill karke add karein!
              </p>
            </div>
          ) : (
            userWords.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "12px 14px",
                  border: "1px solid #E3E9E1",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#182216",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {item.kokborok_word}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      backgroundColor:
                        item.clustering === "Most used"
                          ? "#FEE2E2"
                          : item.clustering === "Average used"
                          ? "#FEF3C7"
                          : "#E0E7FF",
                      color:
                        item.clustering === "Most used"
                          ? "#991B1B"
                          : item.clustering === "Average used"
                          ? "#92400E"
                          : "#3730A3",
                    }}
                  >
                    {item.clustering || "Most used"}
                  </span>
                </div>

                {/* Word Translations Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "6px",
                    fontSize: "11px",
                    backgroundColor: "#F7F9F6",
                    padding: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <div>
                    <span style={{ color: "#889685", fontSize: "9px", display: "block" }}>
                      ENGLISH
                    </span>
                    <strong style={{ color: "#182216" }}>{item.english_word || "-"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#889685", fontSize: "9px", display: "block" }}>
                      HINDI
                    </span>
                    <strong style={{ color: "#182216" }}>{item.hindi_word || "-"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#889685", fontSize: "9px", display: "block" }}>
                      BENGALI
                    </span>
                    <strong style={{ color: "#182216" }}>{item.bangali_word || "-"}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔻 FOOTER LOGOUT BUTTON */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #E8EFE5",
            backgroundColor: "#FFFFFF",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "14px",
              border: "1px solid #FCA5A5",
              backgroundColor: "#FEF2F2",
              color: "#DC2626",
              fontWeight: "700",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}