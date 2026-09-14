import { useState, useEffect } from "react";

export function useStudentProfile({ currentUser, logout, isOpen, onClose }) {
  const [userWords, setUserWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("words"); // 'words' | 'stats'

  // Backend API Call for Logged-In User Words
  useEffect(() => {
    if (!currentUser?.uid || !isOpen) return;

    let isMounted = true;
    setLoading(true);

    const fetchUserContributions = async () => {
      try {
        const response = await fetch(`/api/contributions/user?userId=${currentUser.uid}`);
        const data = await response.json();

        if (isMounted) {
          if (response.ok) {
            // Backend array response format support
            setUserWords(data.words || data || []);
          } else {
            console.error("API Error:", data.message || "Failed to fetch user contributions");
            setUserWords([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user contributions:", error);
          setUserWords([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserContributions();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid, isOpen]);

  // Statistics Calculation
  const stats = {
    total: userWords.length,
    mostUsed: userWords.filter((w) => w.clustering === "Most used").length,
    averageUsed: userWords.filter((w) => w.clustering === "Average used").length,
    rareUsed: userWords.filter((w) => w.clustering === "Rare used").length,
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      if (onClose) onClose();
    } catch (err) {
      console.error("Logout Failed:", err);
    }
  };

  return {
    userWords,
    loading,
    activeTab,
    setActiveTab,
    stats,
    handleLogout,
  };
}