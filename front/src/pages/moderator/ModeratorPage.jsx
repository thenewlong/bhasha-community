import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Menu, 
  Users, 
  LayoutList, 
  ChevronDown, 
  Eye, 
  Pencil, 
  X, 
  Loader2,
  ShieldCheck,
  LogOut,
  Filter
} from "lucide-react";

export default function ModeratorPage() {
  const { currentUser, logout } = useAuth();

  // Clustering & Status Filter States
  const [activeTab, setActiveTab] = useState("Most used");
  const [statusFilter, setStatusFilter] = useState("all");

  // Backend Data States (PostgreSQL)
  const [wordsList, setWordsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [selectedWord, setSelectedWord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Fetch Words Data from Backend API
  const fetchWords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/moderator/pending");
      const result = await response.json();

      if (response.ok && result.success) {
        setWordsList(result.data || []);
      } else {
        // Fallback for general words endpoint
        const fallbackRes = await fetch("/api/words");
        const fallbackResult = await fallbackRes.json();
        if (fallbackRes.ok && fallbackResult.success) {
          setWordsList(fallbackResult.data || []);
        } else {
          setWordsList([]);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load records. Please check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Filter List according to Active Tab (Clustering) & Status Filter
  const filteredWords = wordsList.filter((item) => {
    const clusterMatch = (item.clustering || "").trim().toLowerCase() === activeTab.trim().toLowerCase();
    const statusMatch = statusFilter === "all" || (item.status || "").toLowerCase() === statusFilter.toLowerCase();
    return clusterMatch && statusMatch;
  });

  // 2. Moderator Save Edit Action (Only Edit & Save feature)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch(`/api/moderator/update/${selectedWord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedWord)
      });

      if (response.ok) {
        setWordsList((prev) =>
          prev.map((item) => (item.id === selectedWord.id ? selectedWord : item))
        );
        setIsEditModalOpen(false);
        alert("Word edited and saved successfully!");
      } else {
        alert("Failed to update word.");
      }
    } catch (err) {
      alert("Error updating word.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* TOP NAVBAR */}
      <header style={{
        height: "64px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={{ border: "none", background: "none", cursor: "pointer", color: "#64748B" }}>
            <Menu size={22} />
          </button>
        </div>

        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" }}>
          Moderator Dashboard
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShieldCheck size={20} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>
                {currentUser?.email || "moderator@gmail.com"}
              </div>
              <div style={{ fontSize: "11px", color: "#059669", fontWeight: "600" }}>Moderator</div>
            </div>
            <ChevronDown size={16} color="#64748B" />
          </div>

          <button
            onClick={logout}
            title="Logout"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FCA5A5",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      {/* BODY LAYOUT */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        
        {/* LEFT SIDEBAR */}
        <aside style={{
          width: "64px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          gap: "16px"
        }}>
          <button style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            backgroundColor: "#ECFDF5",
            border: "none",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <Users size={20} />
          </button>

          <button style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            backgroundColor: "transparent",
            border: "none",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <LayoutList size={20} />
          </button>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ flex: 1, padding: "28px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
          
          {/* WORDS MANAGEMENT TABLE */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", margin: 0 }}>
                Content Review & Editing
              </h2>

              {/* Status Filter Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Filter size={16} color="#64748B" />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: "500",
                    outline: "none"
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* CATEGORY TABS */}
            <div style={{
              display: "inline-flex",
              backgroundColor: "#F1F5F9",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "24px",
              gap: "4px",
              width: "100%",
              maxWidth: "600px"
            }}>
              {["Most used", "Average used", "Rare used"].map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: isActive ? "600" : "500",
                      backgroundColor: isActive ? "#FFFFFF" : "transparent",
                      color: isActive ? "#059669" : "#64748B",
                      cursor: "pointer",
                      boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.04)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* TABLE AND LOADING STATES */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                <p>Loading database records...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "24px", color: "#DC2626", backgroundColor: "#FEF2F2", borderRadius: "8px" }}>
                {error}
              </div>
            ) : filteredWords.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                No words available in <b>"{activeTab}"</b> category with <b>"{statusFilter}"</b> status.
              </div>
            ) : (
              /* DATA TABLE */
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", width: "50px" }}>S.No.</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Kokborok</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>English</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Hindi</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Bangali</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Submitted By</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", textAlign: "center" }}>Status</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", textAlign: "center", width: "110px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWords.map((row, index) => {
                      const status = (row.status || "pending").toLowerCase();
                      return (
                        <tr key={row.id || index} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{index + 1}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{row.kokborok_word}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.english_word}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.hindi_word}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.bangali_word}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#64748B" }}>
                            {row.contributor_name || "Anonymous"}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <span style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "700",
                              textTransform: "capitalize",
                              backgroundColor: status === "approved" ? "#DCFCE7" : status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                              color: status === "approved" ? "#166534" : status === "rejected" ? "#991B1B" : "#92400E"
                            }}>
                              {status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                              
                              {/* View Details Button */}
                              <button
                                title="View Details"
                                onClick={() => {
                                  setSelectedWord(row);
                                  setIsViewModalOpen(true);
                                }}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  backgroundColor: "#EFF6FF",
                                  border: "none",
                                  color: "#2563EB",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer"
                                }}
                              >
                                <Eye size={16} />
                              </button>

                              {/* Edit Button */}
                              <button
                                title="Edit & Save Word"
                                onClick={() => {
                                  setSelectedWord(row);
                                  setIsEditModalOpen(true);
                                }}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  backgroundColor: "#FFFBEB",
                                  border: "none",
                                  color: "#D97706",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer"
                                }}
                              >
                                <Pencil size={16} />
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
        </main>
      </div>

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && selectedWord && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            maxWidth: "450px",
            width: "100%",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
                Word Details
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <div><strong>Kokborok:</strong> {selectedWord.kokborok_word}</div>
              <div><strong>English:</strong> {selectedWord.english_word}</div>
              <div><strong>Hindi:</strong> {selectedWord.hindi_word}</div>
              <div><strong>Bengali:</strong> {selectedWord.bangali_word}</div>
              <div><strong>Clustering:</strong> {selectedWord.clustering}</div>
              <div><strong>Status:</strong> {selectedWord.status || "pending"}</div>
              <div><strong>Submitted By:</strong> {selectedWord.contributor_name || "Anonymous"} ({selectedWord.submitted_by_email || "N/A"})</div>
            </div>

            <button
              onClick={() => setIsViewModalOpen(false)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", backgroundColor: "#059669", color: "#FFFFFF", fontWeight: "600", marginTop: "16px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT & SAVE MODAL */}
      {isEditModalOpen && selectedWord && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            maxWidth: "480px",
            width: "100%",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
                Edit & Save Word Details
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Kokborok Word</label>
                <input
                  type="text"
                  value={selectedWord.kokborok_word || ""}
                  onChange={(e) => setSelectedWord({ ...selectedWord, kokborok_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>English Word</label>
                <input
                  type="text"
                  value={selectedWord.english_word || ""}
                  onChange={(e) => setSelectedWord({ ...selectedWord, english_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Hindi Word</label>
                <input
                  type="text"
                  value={selectedWord.hindi_word || ""}
                  onChange={(e) => setSelectedWord({ ...selectedWord, hindi_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Bangali Word</label>
                <input
                  type="text"
                  value={selectedWord.bangali_word || ""}
                  onChange={(e) => setSelectedWord({ ...selectedWord, bangali_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Clustering Category</label>
                <select
                  value={selectedWord.clustering || "Most used"}
                  onChange={(e) => setSelectedWord({ ...selectedWord, clustering: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box", backgroundColor: "#FFFFFF" }}
                >
                  <option value="Most used">Most used</option>
                  <option value="Average used">Average used</option>
                  <option value="Rare used">Rare used</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    color: "#475569",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#059669",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}