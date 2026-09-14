import React, { useState, useEffect } from "react";
import { 
  Check, 
  X, 
  RefreshCw, 
  Filter, 
  Search, 
  Trash2, 
  Flame, 
  Activity, 
  Target, 
  User, 
  LogOut, 
  ShieldCheck,
  Calendar,
  Layers
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter States
  const [activeTab, setActiveTab] = useState("Most used"); // Options: "All", "Most used", "Average used", "Rare used"
  const [statusFilter, setStatusFilter] = useState("all"); // Options: "all", "pending", "approved", "rejected"

  // 🔄 Fetch All Contributions (Same Data Source as Moderator)
  const fetchContributions = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Direct call to moderator/contributions API to guarantee exact same data
      const res = await fetch("/api/contributions");
      
      if (!res.ok) {
        // Fallback to Admin API if main route fails
        const fallbackRes = await fetch("/api/admin/contributions");
        if (!fallbackRes.ok) throw new Error("Failed to load records from backend.");
        const fallbackData = await fallbackRes.json();
        setContributions(Array.isArray(fallbackData) ? fallbackData : fallbackData.data || []);
        return;
      }

      const data = await res.json();
      const records = Array.isArray(data) ? data : data.data || [];
      setContributions(records);
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      setErrorMsg("Failed to connect to server. Please ensure backend is running.");
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
      alert("Logout failed.");
    }
  };

  // ⚡ Status Update Handler (Approve / Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contributions/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        // Fallback to admin route
        await fetch(`/api/admin/contributions/${id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        });
      }

      // Update UI locally immediately
      setContributions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert("Could not update status. Please try again.");
    }
  };

  // 🗑️ Delete Contribution Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contribution?")) return;
    try {
      await fetch(`/api/contributions/${id}`, { method: "DELETE" });
      setContributions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  // 🔍 Safe Filtering Logic (Case-insensitive matching)
  const filteredContributions = contributions.filter((item) => {
    // 1. Clustering / Tab Filter
    const itemClustering = (item.clustering || "Most used").trim().toLowerCase();
    const currentTab = activeTab.trim().toLowerCase();
    const matchesTab = currentTab === "all" || itemClustering === currentTab;

    // 2. Status Filter
    const itemStatus = (item.status || "pending").trim().toLowerCase();
    const currentStatus = statusFilter.trim().toLowerCase();
    const matchesStatus = currentStatus === "all" || currentStatus === "all status" || itemStatus === currentStatus;

    // 3. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      (item.kokborok_word && item.kokborok_word.toLowerCase().includes(query)) ||
      (item.english_word && item.english_word.toLowerCase().includes(query)) ||
      (item.contributor_name && item.contributor_name.toLowerCase().includes(query));

    return matchesTab && matchesStatus && matchesSearch;
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F8FAF7",
      color: "#182216",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif",
      padding: "20px 12px 40px 12px"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .bhasa-card {
          background: #FFFFFF;
          border: 1px solid #E2E8E0;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }
        .tab-btn {
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .tab-btn-active {
          background-color: #FFFFFF;
          color: #819A70;
          border-color: #D5DDD2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .tab-btn-inactive {
          background-color: transparent;
          color: #657563;
        }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* 🔝 HEADER & LOGOUT */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          backgroundColor: "#FFFFFF",
          padding: "12px 16px",
          borderRadius: "18px",
          border: "1px solid #E2E8E0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#182216" }}>Admin Dashboard</div>
              <div style={{ fontSize: "11px", color: "#657563" }}>{currentUser?.email || "admin@letsbharat.com"}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: "#FEF2F2",
              color: "#EF4444",
              border: "1px solid #FCA5A5",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* 📦 MAIN CONTROL CARD */}
        <div className="bhasa-card" style={{ padding: "20px", marginBottom: "20px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: "#182216" }}>
              Admin Database Review & Control
            </h2>
            <button
              onClick={fetchContributions}
              title="Refresh Data"
              style={{
                background: "#F4F7F2",
                border: "1px solid #D5DDD2",
                padding: "8px",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={15} color="#819A70" className={loading ? "spin-anim" : ""} />
            </button>
          </div>

          {/* 🎯 STATUS FILTER DROPDOWN */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Filter size={15} color="#819A70" />
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#556453" }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "10px",
                border: "1px solid #D5DDD2",
                backgroundColor: "#F8FAF7",
                fontSize: "12px",
                fontWeight: "700",
                color: "#182216",
                outline: "none"
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* 🏷️ CLUSTERING TABS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "4px",
            backgroundColor: "#F4F7F2",
            padding: "4px",
            borderRadius: "14px",
            marginBottom: "16px"
          }}>
            <button
              className={`tab-btn ${activeTab === "All" ? "tab-btn-active" : "tab-btn-inactive"}`}
              onClick={() => setActiveTab("All")}
            >
              All ({contributions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "Most used" ? "tab-btn-active" : "tab-btn-inactive"}`}
              onClick={() => setActiveTab("Most used")}
            >
              Most used
            </button>
            <button
              className={`tab-btn ${activeTab === "Average used" ? "tab-btn-active" : "tab-btn-inactive"}`}
              onClick={() => setActiveTab("Average used")}
            >
              Average
            </button>
            <button
              className={`tab-btn ${activeTab === "Rare used" ? "tab-btn-active" : "tab-btn-inactive"}`}
              onClick={() => setActiveTab("Rare used")}
            >
              Rare used
            </button>
          </div>

          {/* 🔍 SEARCH BAR */}
          <div style={{ position: "relative" }}>
            <Search size={15} color="#819A70" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input
              type="text"
              placeholder="Search by Kokborok, English, or Contributor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "12px",
                border: "1px solid #D5DDD2",
                fontSize: "12px",
                outline: "none",
                backgroundColor: "#FFFFFF"
              }}
            />
          </div>

        </div>

        {/* 🚨 ERROR ALERT */}
        {errorMsg && (
          <div style={{
            backgroundColor: "#FEF2F2",
            color: "#991B1B",
            padding: "12px",
            borderRadius: "14px",
            fontSize: "13px",
            marginBottom: "16px",
            border: "1px solid #FECACA"
          }}>
            {errorMsg}
          </div>
        )}

        {/* 📋 CONTRIBUTIONS LIST */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#657563", fontSize: "14px" }}>
            Loading contributions data...
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="bhasa-card" style={{ textAlign: "center", padding: "36px 20px" }}>
            <p style={{ color: "#657563", fontSize: "14px", margin: 0 }}>
              No words available in <strong>"{activeTab}"</strong> category with <strong>"{statusFilter}"</strong> status.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredContributions.map((item, index) => (
              <div key={item.id || index} className="bhasa-card" style={{ padding: "16px" }}>
                
                {/* Header Info */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <User size={14} color="#819A70" />
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#182216" }}>
                      {item.contributor_name || "Anonymous"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    backgroundColor:
                      (item.status || "pending").toLowerCase() === "approved"
                        ? "#DCFCE7"
                        : (item.status || "pending").toLowerCase() === "rejected"
                        ? "#FEE2E2"
                        : "#FEF3C7",
                    color:
                      (item.status || "pending").toLowerCase() === "approved"
                        ? "#166534"
                        : (item.status || "pending").toLowerCase() === "rejected"
                        ? "#991B1B"
                        : "#92400E"
                  }}>
                    {item.status || "pending"}
                  </span>
                </div>

                {/* Main Word Details */}
                <div style={{
                  backgroundColor: "#F9FAF8",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #EAEFE8",
                  marginBottom: "12px"
                }}>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#819A70", marginBottom: "6px" }}>
                    {item.kokborok_word}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "11px" }}>
                    <div>
                      <span style={{ color: "#888", display: "block" }}>English</span>
                      <strong>{item.english_word || "-"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#888", display: "block" }}>Hindi</span>
                      <strong>{item.hindi_word || "-"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#888", display: "block" }}>Bengali</span>
                      <strong>{item.bangali_word || item.bengali_word || "-"}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Controls / Approve Reject Delete */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#888", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Layers size={12} /> {item.clustering || "Most used"}
                  </span>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleStatusUpdate(item.id, "approved")}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        backgroundColor: "#DCFCE7",
                        color: "#15803D",
                        border: "1px solid #BBF7D0",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Check size={13} /> Approve
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(item.id, "rejected")}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        backgroundColor: "#FEF2F2",
                        color: "#B91C1C",
                        border: "1px solid #FECACA",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <X size={13} /> Reject
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: "6px",
                        borderRadius: "8px",
                        backgroundColor: "#F3F4F6",
                        color: "#6B7280",
                        border: "1px solid #E5E7EB",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}