import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcPZ753VGZyVkcY-10xJc7KiGESScrrwA",
  authDomain: "bhasha-d9ab6.firebaseapp.com",
  projectId: "bhasha-d9ab6",
  storageBucket: "bhasha-d9ab6.firebasestorage.app",
  messagingSenderId: "477111645913",
  appId: "1:477111645913:web:e1783a01975219268bf0c8",
  measurementId: "G-1HGGWF7L6Y"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Only runs in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;