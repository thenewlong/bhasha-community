const admin = require('firebase-admin');
require('dotenv').config();

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "bhasha-d9ab6";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Private Key me newlines (\n) handle karne ke liye
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey,
        }),
      });
      console.log('Firebase Admin Initialized Successfully!');
    } else {
      console.warn('⚠️ Warning: Firebase Client Email ya Private Key missing hai environment variables mein!');
    }
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error.message);
  }
}

// Auth aur Firestore instances (jaha zarurat ho import kar sakte ho)
const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

module.exports = { admin, db, auth };