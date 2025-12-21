import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configure these via Vite env variables in your .env file.
// If not provided, we skip Firebase initialization so the frontend can run with mock data.
const hasFirebaseConfig = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY);

let app: any = null;
let _auth: any = undefined;
let _db: any = undefined;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    app = initializeApp(firebaseConfig);
    _auth = getAuth(app);
    _db = getFirestore(app);
  } catch (err) {
    // If initialization fails, keep auth/db undefined so the app falls back to mock/local behavior
    console.warn('Firebase initialization failed:', err);
    _auth = undefined;
    _db = undefined;
  }
}

export const firebaseAvailable = hasFirebaseConfig && _auth && _db;
export const auth = _auth;
export const db = _db;
