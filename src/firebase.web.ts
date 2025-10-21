import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Senin Firebase Console'dan aldığın config:
const firebaseConfig = {
  apiKey: "AIzaSyAD26IMDbKuAKB2mrTI-H0m8IJR7pIHuD8",
  authDomain: "kasa-ae2cb.firebaseapp.com",
  projectId: "kasa-ae2cb",
  storageBucket: "kasa-ae2cb.firebasestorage.app",
  messagingSenderId: "510257612644",
  appId: "1:510257612644:web:2e138aef2be7fe5d301c71",
  measurementId: "G-9RWRMTGL50"
};

// Firebase app'i tekrar tekrar initialize etmemek için:
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore referansını export et
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
// Offline cache (web). Çoklu sekmede açıkken çakışmaması için best‑effort.
try {
  await enableIndexedDbPersistence(db);
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('[firebase] persistence not enabled', e);
}
export const auth = getAuth(app);
// Bildirimler / e‑postalar için dil tercihleri
if (auth) {
  try { auth.languageCode = 'tr'; } catch {}
}