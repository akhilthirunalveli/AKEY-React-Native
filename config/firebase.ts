import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// You can also use environment variables for production
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAry-7laC83kXpc7lqz3RQB8ZuyHgNRLNE",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "passwordmanager-akhil.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "passwordmanager-akhil",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "passwordmanager-akhil.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "759810516967",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:759810516967:web:d0d5a6b1816cf374cdff42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (only - no auth needed since we use PIN/biometric)
const db = getFirestore(app);

export { db };
export default app;
