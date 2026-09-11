import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  Menu, 
  Users, 
  LayoutList, 
  ChevronDown, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Loader2,
  ShieldCheck,
  UserPlus,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();

  // Firebase Pre-Approve State
  const [newEmail, setNewEmail] = useState("");
  const [roleType, setRoleType] = useState("allowed_moderator");
  const [msg, setMsg] = useState("");

  // Clustering Tabs State
  const [activeTab, setActiveTab] = useState("Most used");

  // Backend Data States (PostgreSQL)
  const [wordsList, setWordsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [selectedWord, setSelectedWord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Firebase Function: Handle Allow Email
  const handleAllowEmail = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await setDoc(doc(db, roleType, newEmail.toLowerCase().trim()), {
        allowedAt: new Date().toISOString()
      });
      setMsg(`Success: ${newEmail} added to ${roleType}`);
      setNewEmail("");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  // 2. Fetch Words Data from Database
  const fetchWords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/admin/words");
      const result = await response.json();

      if (response.ok && result.success) {
        setWordsList(result.data || []);
      } else {
        // Fallback for demo if API endpoint not running yet
        setWordsList([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Note: Make sure backend server is connected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Filter List according to Selected Tab
  const filteredWords = wordsList.filter(
    (item) => item.clustering?.toLowerCase() === activeTab.toLowerCase()
  );

  // 3. Admin Delete Word Action
  const handleDelete = async (id, wordName) => {
    if (!window.confirm(`Admin Permission: Permanently delete "${wordName}"?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setWordsList((prev) => prev.filter((item) => item.id !== id));
        alert("Word deleted permanently!");
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  };

  // 4. Admin Edit Word Action
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/update/${selectedWord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedWord)
      });

      if (response.ok) {
        setWordsList((prev) =>
          prev.map((item) => (item.id === selectedWord.id ? selectedWord : item))
        );
        setIsEditModalOpen(false);
        alert("Word updated successfully!");
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
      
      {/* TOP NAVBAR (Moderator ki jagah ADMIN DASHBOARD likha hai) */}
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
          Admin Dashboard
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShieldCheck size={20} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>
                {currentUser?.email || "admin@gmail.com"}
              </div>
              <div style={{ fontSize: "11px", color: "#2563EB", fontWeight: "600" }}>Super Admin</div>
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
        <main style={{ flex: 1, padding: "28px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
          
          {/* SECTION 1: PRE-APPROVE EMAIL BOX */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "20px 24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <UserPlus size={18} color="#2563EB" />
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                Pre-Approve Moderator or Admin Email
              </h2>
            </div>

            {msg && (
              <p style={{
                fontSize: "13px",
                fontWeight: "600",
                color: msg.startsWith("Error") ? "#DC2626" : "#2563EB",
                marginBottom: "12px",
                margin: 0
              }}>
                {msg}
              </p>
            )}

            <form onSubmit={handleAllowEmail} style={{ display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap" }}>
              <input
                type="email"
                required
                placeholder="Enter Email to Allow"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{
                  flex: "1 1 300px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
              <select
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "#FFFFFF",
                  outline: "none"
                }}
              >
                <option value="allowed_moderator">Allowed Moderator</option>
                <option value="allowed_admin">Allowed Admin</option>
              </select>
              <button
                type="submit"
                style={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Add Permission
              </button>
            </form>
          </div>

          {/* SECTION 2: CLUSTERING TABLE (Exact Design like Screenshot) */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            
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

            {/* TABLE AND LOADING STATES */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                <p>Loading records...</p>
              </div>
            ) : filteredWords.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                No words available in <b>"{activeTab}"</b> category.
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
                      <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", textAlign: "center", width: "120px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWords.map((row, index) => (
                      <tr key={row.id || index} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{index + 1}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{row.kokborok_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.english_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.hindi_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.bangali_word}</td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#334155" }}>{row.contributor_name || "Unknown Debbarma"}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            
                            {/* 1. View / Preview Button (Blue Circle) */}
                            <button
                              title="View Details"
                              onClick={() => alert(`Details:\nKokborok: ${row.kokborok_word}\nEnglish: ${row.english_word}\nHindi: ${row.hindi_word}\nBengali: ${row.bangali_word}`)}
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

                            {/* 2. Edit Button (Orange Circle) */}
                            <button
                              title="Edit Word"
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
                              <Pencil size={15} />
                            </button>

                            {/* 3. Delete Button (Red Circle) - ADMIN HAS DELETE ACCESS */}
                            <button
                              title="Delete Word"
                              onClick={() => handleDelete(row.id, row.kokborok_word)}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "#FEF2F2",
                                border: "none",
                                color: "#EF4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                              }}
                            >
                              <Trash2 size={15} />
                            </button>

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

      {/* EDIT MODAL */}
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
                Admin: Edit Word Details
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
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}