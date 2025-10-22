import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Firebase Console config
const firebaseConfig = {
  apiKey: "AIzaSyAD26IMDbKuAKB2mrTI-H0m8IJR7pIHuD8",
  authDomain: "kasa-ae2cb.firebaseapp.com",
  projectId: "kasa-ae2cb",
  storageBucket: "kasa-ae2cb.firebasestorage.app",
  messagingSenderId: "510257612644",
  appId: "1:510257612644:web:2e138aef2be7fe5d301c71",
  measurementId: "G-9RWRMTGL50"
};

// Avoid re-initializing app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore (keep ignoreUndefinedProperties)
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

// Enable offline cache (non-blocking; no top-level await)
enableIndexedDbPersistence(db).catch((e) => {
  // IndexedDB not available / multiple tabs, etc. It's fine to continue online-only.
  if (typeof console !== 'undefined') {
    console.warn('[firebase.web] IndexedDB persistence not enabled:', e?.message || e);
  }
});

// Auth with local persistence so refresh/restart keeps the same UID
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((e) => {
  if (typeof console !== 'undefined') {
    console.warn('[firebase.web] setPersistence failed:', e?.message || e);
  }
});

// Locale
try { auth.languageCode = 'tr'; } catch {}