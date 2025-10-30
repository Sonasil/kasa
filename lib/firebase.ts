// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBTycxfDSIQunjsSEqxvkK-79lNq7bJ7Y4",
  authDomain: "kasa-fc1ce.firebaseapp.com",
  projectId: "kasa-fc1ce",
  storageBucket: "kasa-fc1ce.appspot.com",
  messagingSenderId: "281748931815",
  appId: "1:281748931815:web:757ede60dc681911910e42",
  measurementId: "G-J6GZ01NNKL"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)