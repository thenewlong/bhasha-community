import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email-only Login session setter for Admin & Moderator
  const setRoleSession = (email, role) => {
    const userSession = { email, role };
    setCurrentUser(userSession);
    setUserRole(role);
    localStorage.setItem("bhasa_user_session", JSON.stringify(userSession));
  };

  // Student Signup Logic
  const signup = async (email, password, fullName) => {
    const role = "student"; 
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName,
      email: email.toLowerCase().trim(),
      role,
      createdAt: new Date().toISOString()
    });

    setCurrentUser(user);
    setUserRole(role);
    return user;
  };

  // Student Login Logic
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      setUserRole(userDoc.data().role);
    } else {
      setUserRole("student");
    }

    setCurrentUser(user);
    return user;
  };

  // Logout Logic
  const logout = () => {
    localStorage.removeItem("bhasa_user_session");
    setCurrentUser(null);
    setUserRole(null);
    return signOut(auth);
  };

  useEffect(() => {
    // Check saved session for Admin/Moderator Email-only login
    const savedSession = localStorage.getItem("bhasa_user_session");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setCurrentUser(parsed);
      setUserRole(parsed.role);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, signup, login, logout, setRoleSession, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};