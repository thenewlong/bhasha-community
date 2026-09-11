// File Path: src/pages/student/ContributionPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ContributionPage() {
  const { currentUser } = useAuth();

  // Form Fields
  const [kokborok, setKokborok] = useState("");
  const [english, setEnglish] = useState("");
  const [hindi, setHindi] = useState("");
  const [bangali, setBangali] = useState("");
  const [clustering, setClustering] = useState("Most used");
  const [contributorName, setContributorName] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Submit Handler Connected to Express Backend & Neon Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg(false);

    // Backend controller expects these specific keys
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
        // Captures backend duplicate error or validation error
        throw new Error(data.message || "Failed to submit word to server.");
      }

      setSuccessMsg(true);
      
      // Reset Form
      setKokborok("");
      setEnglish("");
      setHindi("");
      setBangali("");
      setContributorName("");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F4F7FB",
      display: "flex",
      justifyContent: "center",
      padding: "20px 16px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: "520px", width: "100%" }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "20px", position: "relative" }}>
          <button 
            type="button"
            onClick={() => window.history.back()}
            style={{ position: "absolute", left: 0, top: "4px", border: "none", background: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={24} color="#1E293B" />
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <span style={{ width: "40px", height: "1px", backgroundColor: "#CBD5E1" }}></span>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1E293B", margin: 0 }}>
              Kokborok Word
            </h1>
            <span style={{ width: "40px", height: "1px", backgroundColor: "#CBD5E1" }}></span>
          </div>
          <p style={{ color: "#64748B", fontSize: "16px", marginTop: "2px" }}>contribution</p>
        </div>

        {/* SUCCESS / ERROR ALERTS */}
        {successMsg && (
          <div style={{ backgroundColor: "#ECFDF5", color: "#065F46", padding: "12px", borderRadius: "12px", textAlign: "center", marginBottom: "16px", border: "1px solid #A7F3D0" }}>
            <CheckCircle2 size={18} style={{ display: "inline", marginRight: "6px", verticalAlign: "text-bottom" }} />
            Word submitted successfully for Moderator review!
          </div>
        )}
        {errorMsg && (
          <div style={{ backgroundColor: "#FEF2F2", color: "#991B1B", padding: "12px", borderRadius: "12px", textAlign: "center", marginBottom: "16px", border: "1px solid #FECACA" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* TOP CARD: KOKBOROK WORD */}
          <div style={{
            backgroundColor: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "18px",
            padding: "16px"
          }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>
              Kokborok Word
            </label>
            <input
              type="text"
              required
              placeholder="Enter Kokborok word..."
              value={kokborok}
              onChange={(e) => setKokborok(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #D1D5DB",
                outline: "none",
                fontSize: "14px",
                backgroundColor: "#FFFFFF",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* TREE CONNECTOR LINES */}
          <div style={{ position: "relative", height: "24px", width: "100%" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", backgroundColor: "#60A5FA" }}></div>
            <div style={{ position: "absolute", left: "16%", right: "16%", bottom: 0, height: "2px", backgroundColor: "#60A5FA" }}></div>
            <div style={{ position: "absolute", left: "16%", top: "12px", bottom: 0, width: "2px", backgroundColor: "#60A5FA" }}></div>
            <div style={{ position: "absolute", right: "16%", top: "12px", bottom: 0, width: "2px", backgroundColor: "#60A5FA" }}></div>
          </div>

          {/* THREE TRANSLATION BOXES (TREE BRANCHES) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            
            {/* English Word */}
            <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "14px", padding: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B", display: "block", marginBottom: "6px" }}>
                English Word
              </label>
              <input
                type="text"
                required
                placeholder="Enter English..."
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "11px", boxSizing: "border-box" }}
              />
            </div>

            {/* Hindi Word */}
            <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "14px", padding: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B", display: "block", marginBottom: "6px" }}>
                Hindi Word
              </label>
              <input
                type="text"
                required
                placeholder="Enter Hindi..."
                value={hindi}
                onChange={(e) => setHindi(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "11px", boxSizing: "border-box" }}
              />
            </div>

            {/* Bangali Word */}
            <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "14px", padding: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B", display: "block", marginBottom: "6px" }}>
                Bangali Word
              </label>
              <input
                type="text"
                required
                placeholder="Enter Bangali..."
                value={bangali}
                onChange={(e) => setBangali(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "11px", boxSizing: "border-box" }}
              />
            </div>

          </div>

          {/* CLUSTERING SELECTION */}
          <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>
              Select a clustering
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={clustering}
                onChange={(e) => setClustering(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  appearance: "none",
                  backgroundColor: "#F8FAFC",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              >
                <option value="Most used">Most used</option>
                <option value="Average used">Average used</option>
                <option value="Rare used">Rare used</option>
              </select>
              <ChevronDown size={18} color="#64748B" style={{ position: "absolute", right: "14px", top: "14px", pointerEvents: "none" }} />
            </div>
          </div>

          {/* CONTRIBUTION NAME */}
          <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "18px", padding: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>
              Contribution Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter contribution name..."
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "#FFFFFF",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#93C5FD" : "#2563EB",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "15px",
              padding: "14px",
              borderRadius: "28px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
            }}
          >
            {loading ? "Submitting..." : "Submit Your Words"}
          </button>

        </form>
      </div>
    </div>
  );
}