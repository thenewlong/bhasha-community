import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.js";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

// 📷 File Explorer se logo import
import logoImg from "../../assets/bhasha-logo.jpeg";

import { 
  Check, 
  X, 
  Search, 
  LogOut, 
  RefreshCw, 
  ShieldCheck, 
  Trash2, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  User, 
  Languages,
  Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  const { currentUser, logout, roleSession } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // 'all', 'pending', 'approved', 'rejected'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

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

    return () => {
      if (viewportMeta && originalViewportContent) {
        viewportMeta.setAttribute("content", originalViewportContent);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // 🔄 REAL-TIME FIRESTORE LISTENER (Fetch Contributions)
  // -------------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "contributions"),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setContributions(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching contributions:", error);
        setMessage({ type: "error", text: "Failed to load contribution requests." });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // -------------------------------------------------------------
  // ✅ APPROVE WORD FUNCTION
  // -------------------------------------------------------------
  const handleApprove = async (item) => {
    setActionLoadingId(item.id);
    try {
      // 1. Mark status as Approved in 'contributions' collection
      const contributionRef = doc(db, "contributions", item.id);
      await updateDoc(contributionRef, {
        status: "approved",
        approvedBy: currentUser?.email || roleSession?.email || "Admin",
        approvedAt: serverTimestamp(),
      });

      // 2. Add approved word into main dictionary collection ('approved_dictionary')
      await addDoc(collection(db, "approved_dictionary"), {
        kokborok_word: item.kokborok_word || "",
        english_word: item.english_word || "",
        hindi_word: item.hindi_word || "",
        contributedBy: item.submittedBy || item.userEmail || "Anonymous",
        approvedBy: currentUser?.email || roleSession?.email || "Admin",
        createdAt: serverTimestamp(),
      });

      setMessage({ type: "success", text: `Word "${item.kokborok_word}" approved successfully!` });
    } catch (err) {
      console.error("Approval Error:", err);
      setMessage({ type: "error", text: "Failed to approve the word." });
    } finally {
      setActionLoadingId(null);
    }
  };

  // -------------------------------------------------------------
  // ❌ REJECT WORD FUNCTION
  // -------------------------------------------------------------
  const handleReject = async (id, word) => {
    setActionLoadingId(id);
    try {
      const contributionRef = doc(db, "contributions", id);
      await updateDoc(contributionRef, {
        status: "rejected",
        rejectedBy: currentUser?.email || roleSession?.email || "Admin",
        rejectedAt: serverTimestamp(),
      });

      setMessage({ type: "success", text: `Word "${word}" rejected.` });
    } catch (err) {
      console.error("Rejection Error:", err);
      setMessage({ type: "error", text: "Failed to reject the word." });
    } finally {
      setActionLoadingId(null);
    }
  };

  // -------------------------------------------------------------
  // 🗑️ DELETE WORD FUNCTION
  // -------------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this contribution?")) return;
    setActionLoadingId(id);
    try {
      await deleteDoc(doc(db, "contributions", id));
      setMessage({ type: "success", text: "Contribution deleted permanently." });
    } catch (err) {
      console.error("Delete Error:", err);
      setMessage({ type: "error", text: "Failed to delete item." });
    } finally {
      setActionLoadingId(null);
    }
  };

  // -------------------------------------------------------------
  // 🚪 LOGOUT FUNCTION
  // -------------------------------------------------------------
  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 🔍 Filter Logic
  const filteredContributions = contributions.filter((item) => {
    const matchesStatus = statusFilter === "all" ? true : (item.status || "pending") === statusFilter;
    const matchesSearch = 
      (item.kokborok_word || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.english_word || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.hindi_word || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.submittedBy || item.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Dynamic Statistics
  const totalCount = contributions.length;
  const pendingCount = contributions.filter((c) => (c.status || "pending") === "pending").length;
  const approvedCount = contributions.filter((c) => c.status === "approved").length;
  const rejectedCount = contributions.filter((c) => c.status === "rejected").length;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F4F6F2",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      color: "#2D3728",
      padding: "20px 16px"
    }}>
      <style>{`
        * { touch-action: manipulation; }
        .apple-card {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid #E6ECE1;
          box-shadow: 0 10px 30px rgba(45, 55, 40, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .apple-btn:active { transform: scale(0.96); }
        .custom-input:focus {
          border-color: #5E7053 !important;
          box-shadow: 0 0 0 4px rgba(94, 112, 83, 0.15) !important;
        }
        @media screen and (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* --- HEADER NAV BAR --- */}
      <div className="apple-card" style={{ padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img 
            src={logoImg} 
            alt="BHAShA Logo" 
            style={{ height: "42px", objectFit: "contain" }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#232A20", margin: 0, letterSpacing: "-0.5px" }}>Admin Portal</h1>
              <span style={{ backgroundColor: "#5E7053", color: "#FFFFFF", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>
                Full Access
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#6A7764", margin: 0 }}>Review and moderate multi-language word contributions</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="hide-mobile" style={{ fontSize: "13px", color: "#5E7053", fontWeight: "600", backgroundColor: "#EBF0E8", padding: "8px 14px", borderRadius: "14px" }}>
            👤 {roleSession?.email || currentUser?.email || "Admin User"}
          </span>
          <button
            onClick={handleLogout}
            className="apple-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#FDF2F2",
              color: "#E04848",
              border: "1px solid #F8D7D7",
              padding: "9px 16px",
              borderRadius: "14px",
              fontWeight: "600",
              fontSize: "13px"
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* --- ALERT / NOTIFICATION MESSAGE --- */}
      {message.text && (
        <div style={{
          backgroundColor: message.type === "error" ? "#FDF2F2" : "#F0F7EC",
          color: message.type === "error" ? "#E04848" : "#46563D",
          border: `1px solid ${message.type === "error" ? "#F8D7D7" : "#D4E2CD"}`,
          padding: "12px 18px",
          borderRadius: "16px",
          marginBottom: "20px",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          fontSize: "14px"
        }}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: "", text: "" })} style={{ border: "none", background: "none", cursor: "pointer", color: "inherit", fontWeight: "bold" }}>✕</button>
        </div>
      )}

      {/* --- DASHBOARD STATS CARDS --- */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div className="apple-card" style={{ padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ backgroundColor: "#EBF0E8", color: "#5E7053", padding: "12px", borderRadius: "16px" }}><BookOpen size={24} /></div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#232A20" }}>{totalCount}</div>
            <div style={{ fontSize: "12px", color: "#6A7764", fontWeight: "500" }}>Total Submitted</div>
          </div>
        </div>

        <div className="apple-card" style={{ padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ backgroundColor: "#FEF9C3", color: "#854D0E", padding: "12px", borderRadius: "16px" }}><Clock size={24} /></div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#854D0E" }}>{pendingCount}</div>
            <div style={{ fontSize: "12px", color: "#854D0E", fontWeight: "600" }}>Pending Approval</div>
          </div>
        </div>

        <div className="apple-card" style={{ padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ backgroundColor: "#DCFCE7", color: "#166534", padding: "12px", borderRadius: "16px" }}><CheckCircle2 size={24} /></div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#166534" }}>{approvedCount}</div>
            <div style={{ fontSize: "12px", color: "#166534", fontWeight: "600" }}>Approved Words</div>
          </div>
        </div>

        <div className="apple-card" style={{ padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "12px", borderRadius: "16px" }}><XCircle size={24} /></div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#991B1B" }}>{rejectedCount}</div>
            <div style={{ fontSize: "12px", color: "#991B1B", fontWeight: "600" }}>Rejected Entries</div>
          </div>
        </div>
      </div>

      {/* --- SEARCH & FILTER CONTROLS BAR --- */}
      <div className="apple-card" style={{ padding: "18px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        
        {/* Search Bar */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search Kokborok, English, Hindi, or Contributor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="custom-input"
            style={{
              width: "100%",
              backgroundColor: "#F9FAFAF8",
              border: "1px solid #E1E7DC",
              borderRadius: "16px",
              padding: "12px 14px 12px 42px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          <Search size={18} color="#788871" style={{ position: "absolute", left: "14px", top: "13px" }} />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
            { id: "all", label: "All Contributions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className="apple-btn"
              style={{
                padding: "10px 16px",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: "600",
                border: "none",
                backgroundColor: statusFilter === tab.id ? "#5E7053" : "#EBF0E8",
                color: statusFilter === tab.id ? "#FFFFFF" : "#5E7053",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTRIBUTIONS DATA TABLE --- */}
      <div className="apple-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAF7", borderBottom: "1px solid #E6ECE1", color: "#5E7053", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <th style={{ padding: "16px 20px" }}>Kokborok Word</th>
                <th style={{ padding: "16px 20px" }}>English Meaning</th>
                <th style={{ padding: "16px 20px" }}>Hindi Meaning</th>
                <th style={{ padding: "16px 20px" }}>Submitted By</th>
                <th style={{ padding: "16px 20px" }}>Status</th>
                <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#6A7764" }}>
                    <RefreshCw size={24} className="spin" style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
                    <div>Loading submissions...</div>
                  </td>
                </tr>
              ) : filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#6A7764" }}>
                    <Sparkles size={28} color="#5E7053" style={{ marginBottom: "8px" }} />
                    <div style={{ fontWeight: "600", fontSize: "15px" }}>No contributions found</div>
                    <div style={{ fontSize: "13px" }}>Try changing your search or filter options.</div>
                  </td>
                </tr>
              ) : (
                filteredContributions.map((item) => {
                  const currentStatus = item.status || "pending";
                  const isPending = currentStatus === "pending";

                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #F0F4EE", transition: "background-color 0.2s" }}>
                      
                      {/* Kokborok Word */}
                      <td style={{ padding: "16px 20px", fontWeight: "700", color: "#232A20" }}>
                        {item.kokborok_word || "—"}
                      </td>

                      {/* English Meaning */}
                      <td style={{ padding: "16px 20px", color: "#46563D" }}>
                        {item.english_word || "—"}
                      </td>

                      {/* Hindi Meaning */}
                      <td style={{ padding: "16px 20px", color: "#46563D" }}>
                        {item.hindi_word || "—"}
                      </td>

                      {/* Submitter */}
                      <td style={{ padding: "16px 20px", fontSize: "13px", color: "#6A7764" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <User size={14} color="#788871" />
                          <span>{item.submittedBy || item.userEmail || "Anonymous"}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          backgroundColor: 
                            currentStatus === "approved" ? "#DCFCE7" :
                            currentStatus === "rejected" ? "#FEE2E2" : "#FEF9C3",
                          color: 
                            currentStatus === "approved" ? "#166534" :
                            currentStatus === "rejected" ? "#991B1B" : "#854D0E",
                        }}>
                          {currentStatus}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          
                          {/* Approve Button */}
                          {isPending && (
                            <button
                              onClick={() => handleApprove(item)}
                              disabled={actionLoadingId === item.id}
                              className="apple-btn"
                              title="Approve Word"
                              style={{
                                backgroundColor: "#5E7053",
                                color: "#FFFFFF",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              <Check size={15} /> Approve
                            </button>
                          )}

                          {/* Reject Button */}
                          {isPending && (
                            <button
                              onClick={() => handleReject(item.id, item.kokborok_word)}
                              disabled={actionLoadingId === item.id}
                              className="apple-btn"
                              title="Reject Word"
                              style={{
                                backgroundColor: "#FDF2F2",
                                color: "#E04848",
                                border: "1px solid #F8D7D7",
                                padding: "8px 12px",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              <X size={15} /> Reject
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={actionLoadingId === item.id}
                            className="apple-btn"
                            title="Delete Entry"
                            style={{
                              backgroundColor: "#F4F6F2",
                              color: "#6A7764",
                              border: "1px solid #E1E7DC",
                              padding: "8px 10px",
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}