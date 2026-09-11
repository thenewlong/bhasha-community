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
  CheckCircle2
} from "lucide-react";

export default function ModeratorPage() {
  const { currentUser } = useAuth();

  // Active Tab State: 'Most used' | 'Average used' | 'Rare used'
  const [activeTab, setActiveTab] = useState("Most used");
  
  // Data States from PostgreSQL Backend
  const [pendingWords, setPendingWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States for Edit & Read
  const [selectedWord, setSelectedWord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. READ: Fetch Live Pending Words from PostgreSQL
  const fetchPendingWords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/moderator/pending");
      const result = await response.json();

      if (response.ok && result.success) {
        setPendingWords(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch pending words.");
      }
    } catch (err) {
      console.error("Error fetching moderator data:", err);
      setError("Unable to connect to database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWords();
  }, []);

  // Category ke hisab se filter
  const filteredWords = pendingWords.filter(
    (item) => item.clustering?.toLowerCase() === activeTab.toLowerCase()
  );

  // 2. WRITE: Approve Word Direct (Status = Approved -> Admin Dashboard Me Jayega)
  const handleApprove = async (wordItem) => {
    if (!window.confirm(`Approve "${wordItem.kokborok_word}" and send to Admin?`)) return;

    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/moderator/review/${wordItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...wordItem,
          status: "approved" // Move to Admin
        })
      });

      if (response.ok) {
        setPendingWords((prev) => prev.filter((item) => item.id !== wordItem.id));
        alert("Word approved and sent to Admin Dashboard successfully!");
      } else {
        alert("Failed to approve word.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. WRITE: Edit Details & Save (Auto Approve to Admin)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/moderator/review/${selectedWord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kokborok_word: selectedWord.kokborok_word,
          english_word: selectedWord.english_word,
          hindi_word: selectedWord.hindi_word,
          bangali_word: selectedWord.bangali_word,
          clustering: selectedWord.clustering,
          status: "approved" // Update & Move to Admin
        })
      });

      if (response.ok) {
        setPendingWords((prev) => prev.filter((item) => item.id !== selectedWord.id));
        setIsEditModalOpen(false);
        alert("Word edited and approved successfully!");
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

        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" }}>
          Moderators
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#CBD5E1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Users size={20} color="#475569" />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>
              {currentUser?.email || "johndebbarma23@gmail.com"}
            </div>
            <div style={{ fontSize: "11px", color: "#64748B" }}>Moderator (Read/Write)</div>
          </div>
          <ChevronDown size={16} color="#64748B" />
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
            backgroundColor: "#EFF6FF",
            border: "none",
            color: "#2563EB",
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
        <main style={{ flex: 1, padding: "28px" }}>
          
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            
            {/* CARD TITLE */}
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginTop: 0, marginBottom: "20px" }}>
              Clustering
            </h2>

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
                      color: isActive ? "#2563EB" : "#64748B",
                      cursor: "pointer",
                      boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.04)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {tab === "Most used" ? "Most Used" : tab === "Average used" ? "Average Used" : "Rare Used"}
                  </button>
                );
              })}
            </div>

            {/* TABLE / LOADING STATES */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                <p>Loading pending contributions from PostgreSQL...</p>
              </div>
            ) : error ? (
              <div style={{ backgroundColor: "#FEF2F2", color: "#991B1B", padding: "16px", borderRadius: "10px" }}>
                {error}
              </div>
            ) : filteredWords.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                No pending words found in <b>"{activeTab}"</b> category.
              </div>
            ) : (
              /* DATA TABLE */
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", width: "60px" }}>S.No.</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Kokborok Word</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>English Word</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Hindi Word</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Bangali Word</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Contributor Name</th>
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", textAlign: "center", width: "100px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWords.map((row, index) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{index + 1}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{row.kokborok_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.english_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.hindi_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.bangali_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.contributor_name || "Anonymous"}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            
                            {/* 1. Quick Approve Button (Blue Circle) */}
                            <button
                              title="Direct Approve (Send to Admin)"
                              onClick={() => handleApprove(row)}
                              disabled={actionLoading}
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

                            {/* 2. Edit & Approve Button (Orange Circle) */}
                            <button
                              title="Edit Word details"
                              onClick={() => {
                                setSelectedWord(row);
                                setIsEditModalOpen(true);
                              }}
                              disabled={actionLoading}
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
                              <Pencil size={15} />
                            </button>

                            {/* DELETE BUTTON IS REMOVED HERE - MODERATOR HAS NO DELETE PERMISSION */}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* EDIT MODAL DIALOG (WRITE PERMISSION) */}
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
                Edit & Approve Contribution
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
                  value={selectedWord.kokborok_word}
                  onChange={(e) => setSelectedWord({ ...selectedWord, kokborok_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>English Word</label>
                <input
                  type="text"
                  value={selectedWord.english_word}
                  onChange={(e) => setSelectedWord({ ...selectedWord, english_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Hindi Word</label>
                <input
                  type="text"
                  value={selectedWord.hindi_word}
                  onChange={(e) => setSelectedWord({ ...selectedWord, hindi_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Bangali Word</label>
                <input
                  type="text"
                  value={selectedWord.bangali_word}
                  onChange={(e) => setSelectedWord({ ...selectedWord, bangali_word: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Clustering Category</label>
                <select
                  value={selectedWord.clustering}
                  onChange={(e) => setSelectedWord({ ...selectedWord, clustering: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", boxSizing: "border-box" }}
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
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", backgroundColor: "#2563EB", color: "#FFFFFF", fontWeight: "600", cursor: "pointer" }}
                >
                  {actionLoading ? "Saving..." : "Save & Approve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}