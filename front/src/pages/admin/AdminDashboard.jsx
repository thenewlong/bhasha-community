import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/bhasha-logos.jpeg";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LogOut, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  User, 
  AlertCircle 
} from "lucide-react";

export default function AdminDashboard() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
  
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // 🔄 Fetch Contributions Function (Same Endpoint as Moderator)
  const fetchContributions = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Moderator ke tarah `/api/contributions` se fetch kar rahe hain
      const res = await fetch("/api/contributions");
      
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      
      const data = await res.json();
      
      // Data format check (Array verification)
      if (Array.isArray(data)) {
        setContributions(data);
      } else if (data.contributions && Array.isArray(data.contributions)) {
        setContributions(data.contributions);
      } else {
        setContributions([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setErrorMsg("Failed to fetch contribution data. Please check backend API server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // 🚪 Logout Handler
  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/auth");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // 🔘 Action Handlers (Approve / Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contributions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Local state update
        setContributions(prev => 
          prev.map(item => item._id === id || item.id === id ? { ...item, status: newStatus } : item)
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Error updating contribution status");
    }
  };

  // Filtered List
  const filteredData = contributions.filter(item => {
    if (filter === "all") return true;
    return (item.status || "pending").toLowerCase() === filter;
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F4F7F2",
      color: "#182216",
      padding: "20px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* 🔝 HEADER / NAVBAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: "12px 20px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={logo} alt="Logo" style={{ height: "36px", objectFit: "contain" }} />
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#182216" }}>Admin Dashboard</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#657563" }}>Manage Kokborok Contributions</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={fetchContributions}
              title="Refresh Data"
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #D5DDD2",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#556453"
              }}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #FCA5A5",
                backgroundColor: "#FEF2F2",
                color: "#EF4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* ⚠️ ERROR MESSAGE */}
        {errorMsg && (
          <div style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px"
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 📊 STATS & FILTER TABS */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}>
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: filter === tab ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                backgroundColor: filter === tab ? "#819A70" : "#FFFFFF",
                color: filter === tab ? "#FFFFFF" : "#556453",
                fontWeight: "700",
                fontSize: "12px",
                textTransform: "capitalize",
                cursor: "pointer"
              }}
            >
              {tab} ({contributions.filter(c => tab === "all" ? true : (c.status || "pending").toLowerCase() === tab).length})
            </button>
          ))}
        </div>

        {/* 📝 DATA TABLE / CARDS */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#657563" }}>
            <p style={{ fontSize: "15px", fontWeight: "600" }}>Loading contribution words...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{
            backgroundColor: "#FFFFFF",
            padding: "40px 20px",
            borderRadius: "16px",
            textAlign: "center",
            color: "#657563",
            border: "1px solid #E3E9E1"
          }}>
            <BookOpen size={32} color="#819A70" style={{ marginBottom: "8px" }} />
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>No contribution words found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredData.map((item, index) => {
              const status = (item.status || "pending").toLowerCase();
              return (
                <div
                  key={item._id || item.id || index}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E3E9E1",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontSize: "18px", fontWeight: "800", color: "#182216", marginRight: "10px" }}>
                        {item.kokborok_word || item.kokborok}
                      </span>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "10px",
                        backgroundColor: "#F0F4EE",
                        color: "#819A70"
                      }}>
                        {item.clustering || "Most used"}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      textTransform: "uppercase",
                      backgroundColor: status === "approved" ? "#DCFCE7" : status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                      color: status === "approved" ? "#166534" : status === "rejected" ? "#991B1B" : "#92400E"
                    }}>
                      {status}
                    </span>
                  </div>

                  {/* Translations */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "8px",
                    backgroundColor: "#F9FAF8",
                    padding: "10px",
                    borderRadius: "10px"
                  }}>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#888", display: "block" }}>ENGLISH</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#182216" }}>{item.english_word || item.english || "-"}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#888", display: "block" }}>HINDI</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#182216" }}>{item.hindi_word || item.hindi || "-"}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#888", display: "block" }}>BENGALI</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#182216" }}>{item.bangali_word || item.bangali || "-"}</span>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ fontSize: "11px", color: "#657563", display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={12} />
                      <span>By: {item.contributor_name || item.submitted_by_email || "Anonymous"}</span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleStatusUpdate(item._id || item.id, "approved")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "#819A70",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <CheckCircle2 size={13} />
                        Approve
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(item._id || item.id, "rejected")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #FCA5A5",
                          backgroundColor: "#FFFFFF",
                          color: "#EF4444",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}