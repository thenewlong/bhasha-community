import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  ShieldCheck, 
  Check, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw, 
  Layers, 
  Leaf, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // State Management
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Search State
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
  const [searchTerm, setSearchTerm] = useState("");

  // -------------------------------------------------------------
  // 📥 FETCH ALL CONTRIBUTIONS FROM BACKEND API
  // -------------------------------------------------------------
  const fetchContributions = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // API call to fetch all submitted words (Pending, Approved, Rejected)
      const response = await fetch("/api/admin/contributions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.accessToken || ""}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contribution data.");
      }

      const data = await response.json();
      setContributions(data.contributions || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setErrorMsg(err.message || "Failed to load submitted words.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // -------------------------------------------------------------
  // ✅ APPROVE / ❌ REJECT / 🗑️ DELETE ACTIONS
  // -------------------------------------------------------------
  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(id);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`/api/admin/contributions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.accessToken || ""}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status to ${newStatus}`);
      }

      // Local State Update
      setContributions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      setSuccessMsg(`Word successfully marked as ${newStatus}!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteWord = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this word entry?")) return;

    setActionLoading(id);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`/api/admin/contributions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${currentUser?.accessToken || ""}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete word from database.");
      }

      // Remove from Local State
      setContributions((prev) => prev.filter((item) => item.id !== id));
      setSuccessMsg("Word entry permanently deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Delete operation failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------------------------------------------
  // 🔍 FILTER & SEARCH LOGIC
  // -------------------------------------------------------------
  const filteredContributions = contributions.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status?.toLowerCase() === statusFilter.toLowerCase();
    
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !search ||
      item.kokborok_word?.toLowerCase().includes(search) ||
      item.english_word?.toLowerCase().includes(search) ||
      item.hindi_word?.toLowerCase().includes(search) ||
      item.bangali_word?.toLowerCase().includes(search) ||
      item.contributor_name?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  // Analytics Stats Calculation
  const totalCount = contributions.length;
  const pendingCount = contributions.filter((c) => (c.status || "pending").toLowerCase() === "pending").length;
  const approvedCount = contributions.filter((c) => c.status?.toLowerCase() === "approved").length;
  const rejectedCount = contributions.filter((c) => c.status?.toLowerCase() === "rejected").length;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F8FAF7",
      color: "#182216",
      padding: "24px 16px 60px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* 🔝 ADMIN HEADER BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
          backgroundColor: "#FFFFFF",
          padding: "18px 24px",
          borderRadius: "20px",
          border: "1px solid #E3E9E1",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={26} color="#819A70" />
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#182216", margin: 0 }}>
                Admin & Moderator Portal
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "#657563", margin: "4px 0 0 0" }}>
              Review, approve, and manage all user-submitted Kokborok translations.
            </p>
          </div>

          <button
            onClick={fetchContributions}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#819A70",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 18px",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Queue
          </button>
        </div>

        {/* 📊 ANALYTICS STATS CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "24px"
        }}>
          {/* Total Submissions */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "16px", border: "1px solid #E3E9E1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#657563" }}>TOTAL SUBMISSIONS</span>
              <Layers size={18} color="#819A70" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#182216", marginTop: "8px" }}>
              {totalCount}
            </div>
          </div>

          {/* Pending Review */}
          <div style={{ backgroundColor: "#FFFBEB", padding: "16px", borderRadius: "16px", border: "1px solid #FCD34D" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#B45309" }}>PENDING QUEUE</span>
              <Clock size={18} color="#D97706" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#92400E", marginTop: "8px" }}>
              {pendingCount}
            </div>
          </div>

          {/* Approved Words */}
          <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "16px", border: "1px solid #86EFAC" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#15803D" }}>APPROVED WORDS</span>
              <CheckCircle size={18} color="#16A34A" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#166534", marginTop: "8px" }}>
              {approvedCount}
            </div>
          </div>

          {/* Rejected Words */}
          <div style={{ backgroundColor: "#FEF2F2", padding: "16px", borderRadius: "16px", border: "1px solid #FCA5A5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#B91C1C" }}>REJECTED WORDS</span>
              <XCircle size={18} color="#DC2626" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#991B1B", marginTop: "8px" }}>
              {rejectedCount}
            </div>
          </div>
        </div>

        {/* 🔔 ALERT MESSAGES */}
        {errorMsg && (
          <div style={{ backgroundColor: "#FEF2F2", color: "#991B1B", padding: "12px 16px", borderRadius: "14px", marginBottom: "16px", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: "#F0FDF4", color: "#166534", padding: "12px 16px", borderRadius: "14px", marginBottom: "16px", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 🔍 SEARCH AND STATUS FILTER CONTROLS */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          backgroundColor: "#FFFFFF",
          padding: "14px 18px",
          borderRadius: "16px",
          border: "1px solid #E3E9E1"
        }}>
          {/* Search Box */}
          <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
            <Search size={16} color="#819A70" style={{ position: "absolute", left: "12px", top: "12px" }} />
            <input
              type="text"
              placeholder="Search by word or contributor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "10px",
                border: "1px solid #D5DDD2",
                outline: "none",
                fontSize: "13px"
              }}
            />
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "700",
                  border: statusFilter === st ? "1.5px solid #819A70" : "1px solid #D5DDD2",
                  backgroundColor: statusFilter === st ? "#819A70" : "#FFFFFF",
                  color: statusFilter === st ? "#FFFFFF" : "#556453",
                  cursor: "pointer",
                  textTransform: "capitalize"
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 📋 CONTRIBUTIONS DATA TABLE / LIST */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E3E9E1",
          overflow: "hidden",
          boxShadow: "0 4px 14px rgba(0,0,0,0.02)"
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#657563" }}>
              Loading contributions data...
            </div>
          ) : filteredContributions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#657563" }}>
              No submitted words found in this section.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F4F7F2", borderBottom: "1px solid #E3E9E1", color: "#4A5847", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>
                    <th style={{ padding: "14px 16px" }}>Kokborok Word</th>
                    <th style={{ padding: "14px 16px" }}>Translations (EN / HI / BN)</th>
                    <th style={{ padding: "14px 16px" }}>Clustering</th>
                    <th style={{ padding: "14px 16px" }}>Contributor</th>
                    <th style={{ padding: "14px 16px" }}>Status</th>
                    <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContributions.map((item) => {
                    const status = (item.status || "pending").toLowerCase();
                    const isPending = status === "pending";
                    const isApproved = status === "approved";
                    const isRejected = status === "rejected";

                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #E3E9E1" }}>
                        
                        {/* Kokborok Word */}
                        <td style={{ padding: "14px 16px", fontWeight: "800", color: "#182216" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Leaf size={14} color="#819A70" />
                            <span>{item.kokborok_word}</span>
                          </div>
                        </td>

                        {/* Translations */}
                        <td style={{ padding: "14px 16px", color: "#4A5847" }}>
                          <div><strong>EN:</strong> {item.english_word || "—"}</div>
                          {item.hindi_word && <div style={{ fontSize: "12px", color: "#657563" }}><strong>HI:</strong> {item.hindi_word}</div>}
                          {item.bangali_word && <div style={{ fontSize: "12px", color: "#657563" }}><strong>BN:</strong> {item.bangali_word}</div>}
                        </td>

                        {/* Clustering Tag */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: "700",
                            backgroundColor: "#EEF3EC",
                            color: "#4A5847"
                          }}>
                            {item.clustering || "Most used"}
                          </span>
                        </td>

                        {/* Contributor */}
                        <td style={{ padding: "14px 16px", color: "#4A5847" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <User size={13} color="#819A70" />
                            <span style={{ fontWeight: "600" }}>{item.contributor_name || "Contributor"}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#888888" }}>{item.submitted_by_email || ""}</div>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            backgroundColor: isApproved ? "#DCFCE7" : isRejected ? "#FEE2E2" : "#FEF3C7",
                            color: isApproved ? "#15803D" : isRejected ? "#B91C1C" : "#B45309"
                          }}>
                            {status}
                          </span>
                        </td>

                        {/* Action Buttons (Full Control for Admin) */}
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                            
                            {/* Approve Button */}
                            <button
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              disabled={actionLoading === item.id || isApproved}
                              title="Approve Word"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: isApproved ? "#E2E8F0" : "#22C55E",
                                color: "#FFFFFF",
                                cursor: isApproved ? "not-allowed" : "pointer",
                                opacity: isApproved ? 0.6 : 1
                              }}
                            >
                              <Check size={15} />
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              disabled={actionLoading === item.id || isRejected}
                              title="Reject Word"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: isRejected ? "#E2E8F0" : "#F97316",
                                color: "#FFFFFF",
                                cursor: isRejected ? "not-allowed" : "pointer",
                                opacity: isRejected ? 0.6 : 1
                              }}
                            >
                              <X size={15} />
                            </button>

                            {/* Delete Permanently Button */}
                            <button
                              onClick={() => handleDeleteWord(item.id)}
                              disabled={actionLoading === item.id}
                              title="Delete Entry"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#EF4444",
                                color: "#FFFFFF",
                                cursor: "pointer"
                              }}
                            >
                              <Trash2 size={15} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}